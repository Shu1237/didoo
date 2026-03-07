"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Minus, Plus, ShieldCheck, Ticket } from "lucide-react";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicketType";
import { useBooking } from "@/hooks/useBooking";
import { useGetMe } from "@/hooks/useUser";
import { TicketType } from "@/types/ticketType";
import { toast } from "sonner";

type SelectedItem = {
  ticketType: TicketType;
  quantity: number;
};

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: eventRes, isLoading: isEventLoading } = useGetEvent(id);
  const { data: ticketTypesRes, isLoading: isTicketTypesLoading } = useGetTicketTypes(
    { eventId: id, pageNumber: 1, pageSize: 100 },
    { enabled: !!id },
  );
  const { data: userRes, isLoading: isUserLoading } = useGetMe();
  const { create } = useBooking();

  const event = eventRes?.data;
  const ticketTypes = ticketTypesRes?.data?.items || [];
  const user = userRes?.data;

  const [selected, setSelected] = useState<SelectedItem[]>([]);

  const selectedMap = useMemo(() => {
    return new Map(selected.map((item) => [item.ticketType.id, item]));
  }, [selected]);

  const handleToggleTicketType = (ticketType: TicketType) => {
    setSelected((prev) => {
      const existing = prev.find((item) => item.ticketType.id === ticketType.id);
      if (existing) {
        return prev.filter((item) => item.ticketType.id !== ticketType.id);
      }

      if ((ticketType.availableQuantity ?? 0) <= 0) return prev;
      return [...prev, { ticketType, quantity: 1 }];
    });
  };

  const handleQuantityChange = (ticketTypeId: string, delta: number) => {
    setSelected((prev) =>
      prev
        .map((item) => {
          if (item.ticketType.id !== ticketTypeId) return item;

          const maxQuantity = Math.max(item.ticketType.availableQuantity ?? 0, 0);
          const nextQuantity = Math.min(maxQuantity, Math.max(0, item.quantity + delta));

          if (nextQuantity === 0) return null;
          return { ...item, quantity: nextQuantity };
        })
        .filter(Boolean) as SelectedItem[],
    );
  };

  const handleRemoveTicketType = (ticketTypeId: string) => {
    setSelected((prev) => prev.filter((item) => item.ticketType.id !== ticketTypeId));
  };

  const totalQuantity = selected.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selected.reduce(
    (sum, item) => sum + item.quantity * (item.ticketType.price || 0),
    0,
  );

  const handleSubmit = async () => {
    if (!user?.id || !event?.id || selected.length === 0) {
      toast.error("Vui long dang nhap va chon it nhat 1 loai ve");
      return;
    }

    const validSelected = selected.filter((item) => item.quantity > 0);
    if (validSelected.length === 0) {
      toast.error("Vui long chon so luong ve hop le");
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
        validSelected.map((item) =>
          create.mutateAsync({
            ...basePayload,
            ticketTypeId: item.ticketType.id,
            quantity: item.quantity,
          }),
        ),
      );

      const firstWithPayment = results.find((result) => result?.paymentUrl);
      if (firstWithPayment?.paymentUrl) {
        window.location.href = firstWithPayment.paymentUrl;
        return;
      }

      toast.success("Đặt vé thành công");
      router.push("/user/dashboard/tickets");
    } catch {
      // Errors are handled centrally in useBooking.
    }
  };

  if (isEventLoading || isTicketTypesLoading || isUserLoading) return <Loading />;

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy sự kiện để đặt vé.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href="/events">Quay lại danh sách sự kiện</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">Đăng nhập để đặt vé</h1>
          <p className="mt-2 text-zinc-600">
            Bạn cần đăng nhập tài khoản trước khi tiếp tục thanh toán.
          </p>
          <Button asChild className="mt-5 rounded-xl">
            <Link href={`/login?redirect=/events/${id}/booking`}>Đăng nhập</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <Link
          href={`/events/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại sự kiện
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
            Đặt vé sự kiện
          </h1>
          <p className="text-zinc-600">{event.name}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            <h2 className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Ticket className="h-4 w-4" />
              Chọn loại vé
            </h2>

            {ticketTypes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-500">
                Sự kiện hiện chưa mở bán vé.
              </div>
            ) : (
              <div className="space-y-3">
                {ticketTypes.map((ticketType) => {
                  const selectedItem = selectedMap.get(ticketType.id);
                  const isSelected = Boolean(selectedItem);
                  const isSoldOut = (ticketType.availableQuantity ?? 0) <= 0;

                  return (
                    <article
                      key={ticketType.id}
                      className={`rounded-2xl border p-5 transition ${
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      } ${isSoldOut ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-zinc-900">{ticketType.name}</h3>
                          {ticketType.description && (
                            <p className="text-sm text-zinc-600">{ticketType.description}</p>
                          )}
                          <p className="text-xl font-bold text-zinc-900">
                            {Number(ticketType.price || 0).toLocaleString("vi-VN")}đ
                          </p>
                          <p className="text-sm text-zinc-500">
                            Còn lại: {ticketType.availableQuantity ?? 0} vé
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant={isSelected ? "secondary" : "outline"}
                          onClick={() => handleToggleTicketType(ticketType)}
                          disabled={isSoldOut}
                          className="h-10 rounded-xl px-5"
                        >
                          {isSoldOut ? "Hết vé" : isSelected ? "Bỏ chọn" : "Chọn vé"}
                        </Button>
                      </div>

                      {selectedItem && (
                        <div className="mt-4 flex items-center gap-3 border-t border-zinc-200 pt-4">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(ticketType.id, -1)}
                            className="h-9 w-9 rounded-xl border-zinc-200"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-lg font-bold text-zinc-900">
                            {selectedItem.quantity}
                          </span>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(ticketType.id, 1)}
                            disabled={
                              selectedItem.quantity >= (selectedItem.ticketType.availableQuantity ?? 0)
                            }
                            className="h-9 w-9 rounded-xl border-zinc-200"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveTicketType(ticketType.id)}
                            className="ml-auto h-9 rounded-xl px-4 text-zinc-500 hover:text-zinc-700"
                          >
                            Xóa
                          </Button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900">Đơn hàng của bạn</h2>

              {selected.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-600">
                  Chọn loại vé ở bên trái để xem tổng thanh toán.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {selected.map((item) => (
                    <div
                      key={item.ticketType.id}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <p className="font-semibold text-zinc-900">{item.ticketType.name}</p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.quantity} x {Number(item.ticketType.price || 0).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  ))}

                  <div className="space-y-2 border-t border-zinc-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-zinc-600">
                      <span>Tổng số vé</span>
                      <span className="font-semibold text-zinc-900">{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-zinc-900">
                      <span>Tổng thanh toán</span>
                      <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                    <p className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-4 w-4" />
                      Thanh toán an toàn
                    </p>
                    <p className="mt-1 text-zinc-600">Thông tin của bạn được bảo mật trong quá trình thanh toán.</p>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={create.isPending || totalQuantity === 0}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    {create.isPending ? "Đang xử lý..." : "Tiếp tục thanh toán"}
                  </Button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
