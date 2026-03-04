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

      toast.success("Dat ve thanh cong");
      router.push("/user/tickets");
    } catch {
      // Errors are handled centrally in useBooking.
    }
  };

  if (isEventLoading || isTicketTypesLoading || isUserLoading) return <Loading />;

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Khong tim thay su kien de dat ve.</p>
          <Button asChild className="mt-4 rounded-full px-6">
            <Link href="/events">Quay lai danh sach su kien</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Dang nhap de dat ve</h1>
          <p className="mt-2 text-slate-600">
            Ban can dang nhap tai khoan truoc khi tiep tuc thanh toan.
          </p>
          <Button asChild className="mt-5 rounded-full px-6">
            <Link href={`/login?redirect=/events/${id}/booking`}>Dang nhap</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/events/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lai su kien
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Dat ve su kien
          </h1>
          <p className="text-slate-600">{event.name}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-7">
            <h2 className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
              <Ticket className="h-4 w-4" />
              Chon loai ve
            </h2>

            {ticketTypes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                Su kien hien chua mo ban ve.
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
                          ? "border-sky-300 bg-sky-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      } ${isSoldOut ? "opacity-60" : ""}`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-900">{ticketType.name}</h3>
                          {ticketType.description && (
                            <p className="text-sm text-slate-600">{ticketType.description}</p>
                          )}
                          <p className="text-xl font-bold text-slate-900">
                            {Number(ticketType.price || 0).toLocaleString("vi-VN")} VND
                          </p>
                          <p className="text-sm text-slate-500">
                            Con lai: {ticketType.availableQuantity ?? 0} ve
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant={isSelected ? "secondary" : "outline"}
                          onClick={() => handleToggleTicketType(ticketType)}
                          disabled={isSoldOut}
                          className="h-10 rounded-full px-5"
                        >
                          {isSoldOut ? "Het ve" : isSelected ? "Bo chon" : "Chon ve"}
                        </Button>
                      </div>

                      {selectedItem && (
                        <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => handleQuantityChange(ticketType.id, -1)}
                            className="h-9 w-9 rounded-full border-slate-300"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-lg font-bold text-slate-900">
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
                            className="h-9 w-9 rounded-full border-slate-300"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleRemoveTicketType(ticketType.id)}
                            className="ml-auto h-9 rounded-full px-4 text-slate-500 hover:text-slate-700"
                          >
                            Xoa
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
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">Don hang cua ban</h2>

              {selected.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">
                  Chon loai ve o ben trai de xem tong thanh toan.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {selected.map((item) => (
                    <div
                      key={item.ticketType.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="font-semibold text-slate-900">{item.ticketType.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.quantity} x {Number(item.ticketType.price || 0).toLocaleString("vi-VN")} VND
                      </p>
                    </div>
                  ))}

                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Tong so ve</span>
                      <span className="font-semibold text-slate-900">{totalQuantity}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                      <span>Tong thanh toan</span>
                      <span>{totalPrice.toLocaleString("vi-VN")} VND</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <p className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-4 w-4" />
                      Thanh toan an toan
                    </p>
                    <p className="mt-1">Thong tin cua ban duoc bao mat trong qua trinh thanh toan.</p>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={create.isPending || totalQuantity === 0}
                    className="h-12 w-full rounded-full text-base font-semibold"
                  >
                    {create.isPending ? "Dang xu ly..." : "Tiep tuc thanh toan"}
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
