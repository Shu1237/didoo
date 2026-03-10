"use client";

import { Suspense, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AlertTriangle, AlertCircle, CheckCircle2, ChevronLeft, RotateCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Loading from "@/components/loading";
import { useGetMe } from "@/hooks/useAuth";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketListing, useValidateTicketListing } from "@/hooks/useTicket";
import { useGetBooking, useTradeBooking } from "@/hooks/useBooking";
import { tradeBookingCreateSchema, TradeBookingCreateBody } from "@/schemas/booking";
import { handleErrorApi } from "@/lib/errors";

const reasonMap: Record<string, string> = {
  "listing-unavailable": "Listing không còn khả dụng hoặc đã được bán.",
  payment_failed: "Thanh toán thất bại hoặc đã bị hủy.",
};

/** Callback từ payment gateway: fetch bookingId → hiển thị success hoặc fail */
function TradeBookingCallbackResult({
  id,
  listingId,
  bookingId,
}: {
  id: string;
  listingId: string;
  bookingId: string;
}) {
  const { data: bookingRes, isLoading, isError } = useGetBooking(bookingId);
  const booking = bookingRes?.data;

  const isSuccess = booking?.status?.toLowerCase() === "paid" || !!booking?.paidAt;

  if (isLoading) return <Loading />;

  if (isError || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy thông tin giao dịch</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Mã booking không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild className="rounded-xl">
              <Link href={`/resale/${id}/trade-booking/${listingId}/confirm`}>
                <RotateCw className="mr-1 h-4 w-4" />
                Thử lại
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/resale/${id}`}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại resale
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Mua vé resale thành công</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Giao dịch của bạn đã hoàn tất. Vé sẽ được cập nhật trong khu vực vé của tôi.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild className="rounded-xl">
              <Link href="/user/dashboard/tickets">Xem vé của tôi</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={`/resale/${id}`}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Quay lại resale
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const reasonKey = "payment_failed";
  const reasonMessage = reasonMap[reasonKey] || "Không thể hoàn tất giao dịch resale. Vui lòng thử lại.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
          <AlertCircle className="h-8 w-8 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Trade-booking thất bại</h1>
        <p className="mt-2 text-sm text-zinc-600">{reasonMessage}</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button asChild className="rounded-xl">
            <Link href={`/resale/${id}/trade-booking/${listingId}/confirm`}>
              <RotateCw className="mr-1 h-4 w-4" />
              Thử lại
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/resale/${id}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Quay lại resale
            </Link>
            </Button>
          </div>
        </div>
      </main>
    );
}

/** Form tạo trade-booking (khi chưa có bookingId) */
function TradeBookingConfirmForm({
  id,
  listingId,
}: {
  id: string;
  listingId: string;
}) {
  const router = useRouter();
  const { data: userRes, isLoading: isUserLoading } = useGetMe();
  const { data: eventRes, isLoading: isEventLoading } = useGetEvent(id);
  const { data: listingRes, isLoading: isListingLoading } = useGetTicketListing(listingId, {
    enabled: !!listingId,
  });
  const { data: validateRes, isLoading: isValidateLoading } = useValidateTicketListing(listingId, {
    enabled: !!listingId,
  });
  const { create } = useTradeBooking();

  const user = userRes?.data;
  const event = eventRes?.data;
  const listing = listingRes?.data;
  const validateData = validateRes?.data;

  const form = useForm<TradeBookingCreateBody>({
    resolver: zodResolver(tradeBookingCreateSchema),
    defaultValues: {
      listingId,
      buyerUserId: "",
      fullname: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!user?.id) return;
    form.setValue("buyerUserId", user.id);
    form.setValue("fullname", user.fullName || "");
    form.setValue("email", user.email || "");
    form.setValue("phone", user.phone || "");
    form.setValue("listingId", listingId);
  }, [form, listingId, user]);

  const onSubmit = async (values: TradeBookingCreateBody) => {
    if (validateData && validateData.isAvailable === false) {
      router.push(`/resale/${id}/trade-booking/${listingId}/fail?reason=listing-unavailable`);
      return;
    }
    try {
      const result = await create.mutateAsync(values);
      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      router.push(`/resale/${id}/trade-booking/${listingId}/success`);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
      router.push(`/resale/${id}/trade-booking/${listingId}/fail`);
    }
  };

  if (isUserLoading || isEventLoading || isListingLoading || isValidateLoading) return <Loading />;

  if (!event || !listing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Không tìm thấy dữ liệu listing resale.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href={`/resale/${id}`}>Quay lại danh sách listing</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-zinc-600">Bạn cần đăng nhập để tiếp tục mua vé resale.</p>
          <Button asChild className="mt-4 rounded-xl">
            <Link href={`/login?redirect=/resale/${id}/trade-booking/${listingId}/confirm`}>Đăng nhập</Link>
          </Button>
        </div>
      </main>
    );
  }

  const isUnavailable = validateData && validateData.isAvailable === false;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-16 pt-28">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/resale/${id}/trade-booking/${listingId}`}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại chi tiết vé
        </Link>

        {isUnavailable && (
          <Card className="mb-6 border-amber-300 bg-amber-50">
            <CardContent className="flex items-start gap-3 p-4 text-amber-800">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">
                Listing này không còn khả dụng để mua. Vui lòng quay lại chọn listing khác.
              </p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-12">
          <section className="space-y-5 lg:col-span-7">
            <Card className="border-zinc-200">
              <CardHeader>
                <h1 className="text-2xl font-bold text-zinc-900">Xác nhận trade-booking</h1>
                <p className="text-sm text-zinc-600">Sự kiện: {event.name}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <input type="hidden" {...form.register("listingId")} />
                <input type="hidden" {...form.register("buyerUserId")} />

                <div>
                  <label className="text-sm font-medium text-zinc-700">Họ tên</label>
                  <input
                    {...form.register("fullname")}
                    className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-primary"
                    placeholder="Nhập họ tên"
                  />
                  {form.formState.errors.fullname?.message && (
                    <p className="mt-1 text-xs text-rose-600">{String(form.formState.errors.fullname.message)}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Email</label>
                  <input
                    {...form.register("email")}
                    className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-primary"
                    placeholder="Nhập email"
                  />
                  {form.formState.errors.email?.message && (
                    <p className="mt-1 text-xs text-rose-600">{String(form.formState.errors.email.message)}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Số điện thoại</label>
                  <input
                    {...form.register("phone")}
                    className="mt-1 h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none focus:border-primary"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-zinc-900">Thông tin listing</h2>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-zinc-600">
                  Listing ID: <span className="font-semibold text-zinc-900">{listing.id}</span>
                </p>
                <p className="text-zinc-600">
                  Giá bán lại:{" "}
                  <span className="text-lg font-bold text-zinc-900">
                    {Number(listing.askingPrice || 0).toLocaleString("vi-VN")}đ
                  </span>
                </p>
                <p className="text-zinc-600">
                  Trạng thái validate:{" "}
                  <span className="font-semibold text-zinc-900">
                    {isUnavailable ? "Không khả dụng" : "Có thể giao dịch"}
                  </span>
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                <p className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  Flow resale an toàn
                </p>
                <p className="mt-1 text-zinc-600">
                  Validate listing → tạo trade-booking → callback thanh toán → chuyển quyền sở hữu vé.
                </p>
              </div>

              <Button
                type="submit"
                disabled={create.isPending || !!isUnavailable}
                className="mt-5 h-12 w-full rounded-xl text-base font-semibold"
              >
                {create.isPending ? "Đang xử lý..." : "Xác nhận mua vé resale"}
              </Button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function ConfirmPageContent({
  id,
  listingId,
}: {
  id: string;
  listingId: string;
}) {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";

  if (bookingId) {
    return <TradeBookingCallbackResult id={id} listingId={listingId} bookingId={bookingId} />;
  }
  return <TradeBookingConfirmForm id={id} listingId={listingId} />;
}

export default function TradeBookingConfirmPage({
  params,
}: {
  params: Promise<{ id: string; listingId: string }>;
}) {
  const { id, listingId } = use(params);

  return (
    <Suspense fallback={<Loading />}>
      <ConfirmPageContent id={id} listingId={listingId} />
    </Suspense>
  );
}
