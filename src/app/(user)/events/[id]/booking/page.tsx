"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketTypes } from "@/hooks/useTicket";
import { bookingCreateSchema } from "@/schemas/booking";
import { handleErrorApi } from "@/lib/errors";

type BookingDraftItem = {
  ticketTypeId: string;
  quantity: number;
};

const bookingContactSchema = bookingCreateSchema.pick({
  fullname: true,
  email: true,
  phone: true,
});

type BookingContactFormValues = z.infer<typeof bookingContactSchema>;

const getDraftKey = (eventId: string) => `booking-draft:${eventId}`;

export default function EventBookingConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: userRes, isLoading: isUserLoading } = useGetMe();
  const { data: eventRes, isLoading: isEventLoading } = useGetEvent(id);
  const { data: ticketTypesRes, isLoading: isTicketTypesLoading } = useGetTicketTypes(
    { eventId: id, pageNumber: 1, pageSize: 100 },
    { enabled: !!id }
  );
  const { create } = useBooking();

  const user = userRes?.data;
  const event = eventRes?.data;
  const ticketTypes = ticketTypesRes?.data?.items || [];

  const [draftItems, setDraftItems] = useState<BookingDraftItem[]>([]);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = useForm<BookingContactFormValues>({
    resolver: zodResolver(bookingContactSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    const raw = sessionStorage.getItem(getDraftKey(id));
    if (!raw) {
      setDraftItems([]);
      setDraftLoaded(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as BookingDraftItem[];
      const validItems = Array.isArray(parsed)
        ? parsed.filter((item) => item?.ticketTypeId && Number(item?.quantity) > 0)
        : [];
      setDraftItems(validItems);
    } catch {
      setDraftItems([]);
    } finally {
      setDraftLoaded(true);
    }
  }, [id]);

  useEffect(() => {
    if (!user) return;
    if (!getValues("fullname")) setValue("fullname", user.fullName || "");
    if (!getValues("email")) setValue("email", user.email || "");
    if (!getValues("phone")) setValue("phone", user.phone || "");
  }, [user, getValues, setValue]);

  const selectedItems = useMemo(() => {
    const byId = new Map(ticketTypes.map((ticketType) => [ticketType.id, ticketType]));
    return draftItems
      .map((item) => ({
        ...item,
        ticketType: byId.get(item.ticketTypeId),
      }))
      .filter((item) => item.ticketType);
  }, [draftItems, ticketTypes]);

  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.quantity * Number(item.ticketType?.price || 0),
    0
  );

  const handleConfirm = async (formValues: BookingContactFormValues) => {
    if (!user?.id || !event?.id) {
      toast.error("Thiếu thông tin người dùng hoặc sự kiện");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Không có vé để xác nhận");
      return;
    }

    const payloads = selectedItems.map((item) => ({
      ticketTypeId: item.ticketTypeId,
      quantity: item.quantity,
      userId: user.id,
      eventId: event.id,
      fullname: formValues.fullname.trim(),
      email: formValues.email.trim(),
      phone: (formValues.phone || "").trim(),
    }));

    for (const payload of payloads) {
      const parsed = bookingCreateSchema.safeParse(payload);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Thông tin xác nhận không hợp lệ");
        return;
      }
    }

    try {
      const results = await Promise.all(payloads.map((payload) => create.mutateAsync(payload)));
      sessionStorage.removeItem(getDraftKey(id));
      const firstWithPayment = results.find((result) => result?.paymentUrl);
      if (firstWithPayment?.paymentUrl) {
        window.location.href = firstWithPayment.paymentUrl;
        return;
      }
      router.push("/user/dashboard/tickets");
    } catch (error) {
      handleErrorApi({ error, setError });
    }
  };

  if (isUserLoading || isEventLoading || isTicketTypesLoading || !draftLoaded) return <Loading />;

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
          <h1 className="text-2xl font-bold text-zinc-900">Đăng nhập để xác nhận booking</h1>
          <p className="mt-2 text-zinc-600">Bạn cần đăng nhập để tiếp tục đặt vé.</p>
          <Button asChild className="mt-5 rounded-xl">
            <Link href={`/login?redirect=/events/${id}/confirm`}>Đăng nhập</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Bạn chưa chọn vé. Vui lòng quay lại trang sự kiện để chọn vé.</p>
          <Button asChild className="mt-5 rounded-xl">
            <Link href={`/events/${id}`}>Quay lại sự kiện</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <form className="mx-auto max-w-5xl" onSubmit={handleSubmit(handleConfirm)}>
        <Link
          href={`/events/${id}`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại sự kiện
        </Link>

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
