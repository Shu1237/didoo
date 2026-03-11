"use client";

import { use, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, ChevronLeft, HelpCircle, Minus, Plus, ShieldCheck, Ticket } from "lucide-react";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicket";
import { bookingCreateSchema } from "@/schemas/booking";
import { handleErrorApi } from "@/lib/errors";
import { TicketType } from "@/types/ticket";
import { useTicketHub } from "@/hooks/useTicketHub";

type BookingDraftItem = {
  ticketTypeId: string;
  quantity: number;
};

const getDraftKey = (eventId: string) => `booking-draft:${eventId}`;

function saveDraft(eventId: string, items: BookingDraftItem[]) {
  const valid = items.filter((i) => i.quantity > 0);
  sessionStorage.setItem(getDraftKey(eventId), JSON.stringify(valid));
}

const bookingContactSchema = bookingCreateSchema.pick({
  fullname: true,
  email: true,
  phone: true,
});

type BookingContactFormValues = z.infer<typeof bookingContactSchema>;

export default function EventBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: userRes, isLoading: isUserLoading } = useGetMe();
  const { data: eventRes, isLoading: isEventLoading } = useGetEvent(id);
  const { data: ticketTypesRes, isLoading: isTicketTypesLoading } = useGetTicketTypes(
    { eventId: id, pageNumber: 1, pageSize: 100 },
    { enabled: !!id }
  );
  const { create } = useBooking();
  const { realtimeAvailability, lockTickets, unlockTickets } = useTicketHub(id);

  const user = userRes?.data;
  const event = eventRes?.data;
  const ticketTypes = ticketTypesRes?.data?.items || [];
  const ticketMapUrl =
    event?.ticketMapUrl || (event as { ticketMapUrl?: string })?.ticketMapUrl || "";

  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<BookingDraftItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: { fullname: "", email: "", phone: "" },
  });

  useEffect(() => {
    const raw = sessionStorage.getItem(getDraftKey(id));
    if (!raw) {
      setSelected(null);
      setLoaded(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as BookingDraftItem[];
      const valid = Array.isArray(parsed)
        ? parsed.find((i) => i?.ticketTypeId && Number(i?.quantity) > 0)
        : null;
      setSelected(valid || null);
    } catch {
      setSelected(null);
    } finally {
      setLoaded(true);
    }
  }, [id]);

  useEffect(() => {
    if (!user) return;
    if (!getValues("fullname")) setValue("fullname", user.fullName || "");
    if (!getValues("email")) setValue("email", user.email || "");
    if (!getValues("phone")) setValue("phone", user.phone || "");
  }, [user, getValues, setValue]);

  const selectedItems = useMemo(() => {
    if (!selected) return [];
    const tt = ticketTypes.find((t) => t.id === selected.ticketTypeId);
    return tt ? [{ ...selected, ticketType: tt }] : [];
  }, [selected, ticketTypes]);

  const totalPrice = selected
    ? (() => {
        const tt = ticketTypes.find((t) => t.id === selected.ticketTypeId);
        return (tt?.price ?? 0) * selected.quantity;
      })()
    : 0;

  const handleQuantity = (tt: TicketType, delta: number) => {
    const avail = realtimeAvailability[tt.id] ?? Math.max(0, Number(tt.availableQuantity ?? 0));
    if (avail <= 0 && delta > 0) return;

    setSelected((prev) => {
      const isSame = prev?.ticketTypeId === tt.id;
      const nextQty = isSame
        ? Math.max(0, Math.min(avail, (prev?.quantity ?? 0) + delta))
        : delta > 0
          ? Math.min(avail, 1)
          : 0;

      if (nextQty <= 0) {
        saveDraft(id, []);
        unlockTickets(tt.id);
        return null;
      }
      const next = { ticketTypeId: tt.id, quantity: nextQty };
      saveDraft(id, [next]);
      lockTickets(tt.id, nextQty);
      return next;
    });
  };

  const handleGoToConfirm = () => {
    if (!selected || selected.quantity <= 0) {
      toast.error("Vui lòng chọn ít nhất 1 vé (chỉ được chọn 1 loại vé trong 1 đơn)");
      return;
    }
    setStep(2);
  };

  const handleConfirm = async (formValues: BookingContactFormValues) => {
    if (!user?.id || !event?.id) {
      toast.error("Thiếu thông tin người dùng hoặc sự kiện");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Không có vé để xác nhận");
      return;
    }

    const payload = {
      ticketTypeId: selectedItems[0].ticketTypeId,
      quantity: selectedItems[0].quantity,
      userId: user.id,
      eventId: event.id,
      fullname: formValues.fullname.trim(),
      email: formValues.email.trim(),
      phone: (formValues.phone || "").trim(),
    };

    const parsed = bookingCreateSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Thông tin xác nhận không hợp lệ");
      return;
    }

    try {
      const result = await create.mutateAsync(parsed.data);
      sessionStorage.removeItem(getDraftKey(id));
      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      window.location.href = "/user/dashboard/tickets";
    } catch (error) {
      handleErrorApi({ error, setError });
    }
  };

  if (isEventLoading || isTicketTypesLoading || isUserLoading || !loaded) return <Loading />;

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy sự kiện.</p>
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
          <p className="mt-2 text-zinc-600">Bạn cần đăng nhập để tiếp tục đặt vé.</p>
          <Button asChild className="mt-5 rounded-xl">
            <Link href={`/login?redirect=/events/${id}/booking`}>Đăng nhập</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (ticketTypes.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Sự kiện chưa mở bán vé.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href={`/events/${id}`}>Quay lại sự kiện</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (step === 2) {
    if (selectedItems.length === 0) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
          <div className="max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <p className="text-zinc-600">Bạn chưa chọn vé. Vui lòng quay lại chọn vé.</p>
            <Button
              className="mt-5 rounded-xl"
              onClick={() => setStep(1)}
            >
              Chọn vé
            </Button>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
        <form className="mx-auto max-w-5xl" onSubmit={handleSubmit(handleConfirm)}>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại chọn vé
          </button>

          <div className="grid gap-6 lg:grid-cols-12">
            <section className="space-y-5 lg:col-span-7">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <h1 className="text-2xl font-bold text-zinc-900">Xác nhận thông tin booking</h1>
                <p className="mt-1 text-sm text-zinc-600">{event.name}</p>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Họ tên</label>
                    <input
                      {...register("fullname")}
                      className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-primary"
                      placeholder="Nhập họ tên"
                    />
                    {errors.fullname?.message && (
                      <p className="mt-1 text-xs text-rose-600">{String(errors.fullname.message)}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Email</label>
                    <input
                      {...register("email")}
                      className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-primary"
                      placeholder="Nhập email"
                    />
                    {errors.email?.message && (
                      <p className="mt-1 text-xs text-rose-600">{String(errors.email.message)}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Số điện thoại (Không bắt buộc)</label>
                    <input
                      {...register("phone")}
                      className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-primary"
                      placeholder="Nhập số điện thoại"
                    />
                    {errors.phone?.message && (
                      <p className="mt-1 text-xs text-rose-600">{String(errors.phone.message)}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <aside className="lg:col-span-5">
              <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900">Đơn hàng của bạn</h2>
                <div className="mt-5 space-y-4">
                  {selectedItems.map((item) => (
                    <div key={item.ticketTypeId} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="font-semibold text-zinc-900">{item.ticketType?.name}</p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.quantity} x {Number(item.ticketType?.price || 0).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  ))}

                  <div className="space-y-2 border-t border-zinc-200 pt-4">
                    <div className="flex items-center justify-between text-sm text-zinc-600">
                      <span>Tổng số vé</span>
                      <span className="font-semibold text-zinc-900">{selected?.quantity ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold text-zinc-900">
                      <span>Tổng thanh toán</span>
                      <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                    <p className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-4 w-4" />
                      Xác nhận và thanh toán
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={create.isPending}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    {create.isPending ? "Đang xử lý..." : "Xác nhận đặt vé"}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </main>
    );
  }

  const hasTicketMap = !!ticketMapUrl;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/events/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại sự kiện
        </Link>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className={hasTicketMap ? "lg:col-span-6" : "lg:col-span-7"}>
            {hasTicketMap ? (
              <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] min-h-[280px] bg-zinc-100">
                  <Image
                    src={ticketMapUrl}
                    alt="Sơ đồ chỗ ngồi / Map vé"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 rounded-lg bg-white/95 backdrop-blur px-3 py-2 border border-zinc-200 shadow-sm">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-zinc-800">Sơ đồ vé</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-zinc-900">Loại vé</h2>
                <div className="mt-4 space-y-4">
                  {ticketTypes.map((tt) => {
                    const avail = realtimeAvailability[tt.id] ?? Math.max(0, Number(tt.availableQuantity ?? 0));
                    const soldOut = avail <= 0;
                    const isSelected = selected?.ticketTypeId === tt.id;

                    return (
                      <div
                        key={tt.id}
                        className={`rounded-xl border p-4 transition ${
                          soldOut
                            ? "border-zinc-200 bg-zinc-50 opacity-60"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-zinc-900">{tt.name}</h3>
                            {tt.description && (
                              <p className="mt-1 text-sm text-zinc-500">{tt.description}</p>
                            )}
                            <p className="mt-2 text-lg font-bold text-zinc-900">
                              {Number(tt.price || 0).toLocaleString("vi-VN")}đ
                            </p>
                            {soldOut && (
                              <span className="mt-2 inline-block text-xs font-medium text-rose-600">
                                Hết vé
                              </span>
                            )}
                          </div>
                          {!soldOut && (
                            <span className="text-xs font-medium text-zinc-600">
                              Còn {avail} vé
                            </span>
                          )}
                        </div>
                        {!soldOut && (
                          <div className="mt-6 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleQuantity(tt, -1)}
                              disabled={!isSelected || (selected?.quantity ?? 0) <= 0}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-[2rem] text-center font-semibold text-zinc-900">
                              {isSelected ? selected.quantity : 0}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantity(tt, 1)}
                              disabled={isSelected && (selected?.quantity ?? 0) >= avail}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            {!isSelected && (
                              <span className="ml-2 text-xs text-zinc-500">
                                Chỉ được chọn 1 loại vé
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className={hasTicketMap ? "lg:col-span-6" : "lg:col-span-5"}>
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900">Chọn vé</h2>
              <p className="mt-1 text-xs text-zinc-500">Chỉ được chọn 1 loại vé trong 1 đơn</p>

              {hasTicketMap ? (
                <>
                  <div className="mt-4 space-y-4">
                    {ticketTypes.map((tt) => {
                      const avail = realtimeAvailability[tt.id] ?? Math.max(0, Number(tt.availableQuantity ?? 0));
                      const soldOut = avail <= 0;
                      const isSelected = selected?.ticketTypeId === tt.id;

                      return (
                        <div
                          key={tt.id}
                          className={`rounded-xl border p-4 ${
                            soldOut
                              ? "border-zinc-200 bg-zinc-50 opacity-60"
                              : "border-zinc-200 bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-zinc-900">{tt.name}</h3>
                              {tt.description && (
                                <p className="mt-1 text-sm text-zinc-500">{tt.description}</p>
                              )}
                              <p className="mt-2 text-lg font-bold text-zinc-900">
                                {Number(tt.price || 0).toLocaleString("vi-VN")}đ
                              </p>
                              {!soldOut && (
                                <span className="text-xs font-medium text-zinc-600">
                                  Còn {avail} vé
                                </span>
                              )}
                              {soldOut && (
                                <span className="mt-2 inline-block text-xs font-medium text-rose-600">
                                  Hết vé
                                </span>
                              )}
                            </div>
                            {!soldOut && (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantity(tt, -1)}
                                  disabled={!isSelected || (selected?.quantity ?? 0) <= 0}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-[2rem] text-center font-semibold text-zinc-900">
                                  {isSelected ? selected.quantity : 0}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantity(tt, 1)}
                                  disabled={isSelected && (selected?.quantity ?? 0) >= avail}
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-zinc-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">Tổng</span>
                      <span className="text-xl font-bold text-zinc-900">
                        {totalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoToConfirm}
                    disabled={!selected || selected.quantity <= 0}
                    className="mt-6 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                  >
                    Mua vé ngay
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="mt-4 text-center text-xs text-zinc-500">
                    Bằng việc mua vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi.
                  </p>

                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Cần hỗ trợ?</p>
                      <p className="text-xs text-zinc-600">Liên hệ bộ phận chăm sóc khách hàng</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    {selected ? (
                      <div>
                        <p className="font-semibold text-zinc-900">
                          {ticketTypes.find((t) => t.id === selected.ticketTypeId)?.name}
                        </p>
                        <p className="mt-1 text-sm text-zinc-600">
                          {selected.quantity} x{" "}
                          {Number(
                            ticketTypes.find((t) => t.id === selected.ticketTypeId)?.price || 0
                          ).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">Chưa chọn vé</p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-zinc-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">Tổng</span>
                      <span className="text-xl font-bold text-zinc-900">
                        {totalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleGoToConfirm}
                    disabled={!selected || selected.quantity <= 0}
                    className="mt-6 h-14 w-full rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                  >
                    Mua vé ngay
                    <ArrowUpRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="mt-4 text-center text-xs text-zinc-500">
                    Bằng việc mua vé, bạn đồng ý với Điều khoản sử dụng của chúng tôi.
                  </p>

                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">Cần hỗ trợ?</p>
                      <p className="text-xs text-zinc-600">Liên hệ bộ phận chăm sóc khách hàng</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
