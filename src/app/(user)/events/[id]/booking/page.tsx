"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicketType";
import { useBooking } from "@/hooks/useBooking";
import { useGetMe } from "@/hooks/useUser";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Ticket, ChevronLeft, Minus, Plus } from "lucide-react";
import { TicketType } from "@/types/ticketType";
import { toast } from "sonner";

type SelectedItem = { ticketType: TicketType; quantity: number };

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: eventRes } = useGetEvent(id);
  const { data: ticketTypesRes } = useGetTicketTypes({ eventId: id, pageNumber: 1, pageSize: 100 }, { enabled: !!id });
  const { data: userRes } = useGetMe();
  const { create } = useBooking();

  const event = eventRes?.data;
  const ticketTypes = ticketTypesRes?.data?.items || [];
  const user = userRes?.data;

  const [selected, setSelected] = useState<SelectedItem[]>([]);

  const handleSelectTicketType = (tt: TicketType) => {
    setSelected((prev) => {
      const exists = prev.find((s) => s.ticketType.id === tt.id);
      if (exists) return prev;
      return [...prev, { ticketType: tt, quantity: 1 }];
    });
  };

  const handleRemoveTicketType = (ttId: string) => {
    setSelected((prev) => prev.filter((s) => s.ticketType.id !== ttId));
  };

  const handleQuantityChange = (ttId: string, delta: number) => {
    setSelected((prev) =>
      prev.map((s) => {
        if (s.ticketType.id !== ttId) return s;
        const next = Math.max(0, s.quantity + delta);
        if (next === 0) return null;
        return { ...s, quantity: next };
      }).filter(Boolean) as SelectedItem[]
    );
  };

  const totalQuantity = selected.reduce((sum, s) => sum + s.quantity, 0);
  const totalPrice = selected.reduce((sum, s) => sum + s.quantity * (s.ticketType.price || 0), 0);

  const handleSubmit = async () => {
    if (!user?.id || !event?.id || selected.length === 0) {
      toast.error("Vui lòng đăng nhập để đặt vé.");
      return;
    }
    const validSelected = selected.filter((s) => s.quantity > 0);
    if (validSelected.length === 0) {
      toast.error("Vui lòng chọn số lượng vé.");
      return;
    }
    try {
      const basePayload = {
        userId: user.id,
        eventId: event.id,
        fullname: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      };
      const results = await Promise.all(
        validSelected.map((s) =>
          create.mutateAsync({
            ...basePayload,
            ticketTypeId: s.ticketType.id,
            quantity: s.quantity,
          })
        )
      );
      const firstWithPayment = results.find((r) => r?.paymentUrl);
      if (firstWithPayment?.paymentUrl) {
        window.location.href = firstWithPayment.paymentUrl;
      } else {
        toast.success("Đặt vé thành công!");
        router.push("/user/tickets");
      }
    } catch (e) {
      // handleErrorApi in useBooking
    }
  };

  if (!event) return <Loading />;

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Vui lòng đăng nhập để đặt vé</p>
          <Button asChild className="rounded-full bg-primary text-black">
            <Link href={`/login?redirect=/events/${id}/booking`}>Đăng nhập</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link href={`/events/${id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại sự kiện</span>
        </Link>

        <h1 className="text-3xl md:text-4xl font-black uppercase mb-2">{event.name}</h1>
        <p className="text-white/60 mb-12">Chọn loại vé và số lượng</p>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT: Ticket types */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/60 flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Các loại vé
            </h2>
            <div className="space-y-3">
              {ticketTypes.length === 0 ? (
                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center text-white/50">
                  Chưa có loại vé nào
                </div>
              ) : (
                ticketTypes.map((tt) => {
                  const sel = selected.find((s) => s.ticketType.id === tt.id);
                  const isSelected = !!sel;
                  return (
                    <div
                      key={tt.id}
                      onClick={() => handleSelectTicketType(tt)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/20"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{tt.name}</p>
                          {tt.description && <p className="text-sm text-white/60 mt-1">{tt.description}</p>}
                          <p className="text-primary font-black mt-2">{Number(tt.price).toLocaleString("vi-VN")}đ / vé</p>
                        </div>
                        <div className="text-right text-sm text-white/60">
                          <p>Còn lại: {tt.availableQuantity ?? 0} vé</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Selected + quantity */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 p-6 rounded-3xl border border-white/10 bg-white/5 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Đơn hàng của bạn</h2>

              {selected.length === 0 ? (
                <p className="text-white/50 text-sm">Nhấn vào loại vé bên trái để chọn</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {selected.map((s) => (
                      <div key={s.ticketType.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/5">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{s.ticketType.name}</p>
                          <p className="text-sm text-primary">{Number(s.ticketType.price).toLocaleString("vi-VN")}đ</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(s.ticketType.id, -1);
                            }}
                            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold">{s.quantity}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (s.quantity < (s.ticketType.availableQuantity ?? 0)) {
                                handleQuantityChange(s.ticketType.id, 1);
                              }
                            }}
                            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 disabled:opacity-50"
                            disabled={s.quantity >= (s.ticketType.availableQuantity ?? 0)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTicketType(s.ticketType.id);
                            }}
                            className="text-white/50 hover:text-red-400 text-xs ml-1"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Tổng số vé</span>
                      <span className="font-bold">{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-white/80">Tổng thanh toán</span>
                      <span className="font-black text-primary">{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={create.isPending || totalQuantity === 0}
                    className="w-full h-14 rounded-full bg-primary text-black font-bold text-lg hover:bg-primary/90"
                  >
                    {create.isPending ? "Đang xử lý..." : "Tiếp tục thanh toán"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
