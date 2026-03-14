"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/useAuth";
import { useBooking, useGetBookings } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import { BookingTypeStatus } from "@/utils/enum";
import { useGetTicketTypes } from "@/hooks/useTicket";
import { bookingCreateSchema } from "@/schemas/booking";
import { handleErrorApi } from "@/lib/errors";
import { TicketType } from "@/types/ticket";
import { useTicketHub } from "@/hooks/useTicketHub";
import { BookingContent } from "./_components/BookingContent";
import { BookingConfirmContent } from "./_components/BookingConfirmContent";
import { ticketStore$ } from "@/stores/ticketStore";

export type BookingDraftItem = {
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
  const { selectTicket } = useTicketHub(id);
  const user = userRes?.data;
  const { data: bookingsRes } = useGetBookings(
    {
      userId: user?.id,
      eventId: id,
      bookingType: BookingTypeStatus.NORMAL,
      pageNumber: 1,
      pageSize: 100,
      fields: "id,userId,eventId,amount,status,bookingType,bookingDetails",
    },
    { enabled: !!user?.id && !!id }
  );
  const event = eventRes?.data;
  const ticketTypes = ticketTypesRes?.data?.items || [];

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

  const purchasedCountByTicketTypeId = useMemo(() => {
    const map = new Map<string, number>();
    const bookings = bookingsRes?.data?.items ?? [];
    for (const b of bookings) {
      if (b.status === "Cancelled" || b.status === "3") continue;
      const details = b.bookingDetails ?? [];
      for (const d of details) {
        const tid = d.ticketTypeId;
        if (tid) {
          map.set(tid, (map.get(tid) ?? 0) + (d.quantity ?? 0));
        }
      }
      if (details.length === 0 && b.amount) {
        const tid = (b as { ticketTypeId?: string }).ticketTypeId;
        if (tid) map.set(tid, (map.get(tid) ?? 0) + b.amount);
      }
    }
    return map;
  }, [bookingsRes?.data?.items]);

  const maxPerUser = (tt: TicketType) => {
    const v = tt.maxTicketsPerUser;
    return v != null && Number(v) > 0 ? Number(v) : null;
  };

  const maxAllowed = (tt: TicketType) => {
    const avail = ticketStore$.availability[id][tt.id].get() ?? Math.max(0, Number(tt.availableQuantity ?? 0));
    const cap = maxPerUser(tt);
    const purchased = purchasedCountByTicketTypeId.get(tt.id) ?? 0;
    if (cap != null) {
      const remaining = Math.max(0, cap - purchased);
      return Math.min(remaining, avail);
    }
    return avail;
  };

  const hasReachedMax = (tt: TicketType) => {
    const cap = maxPerUser(tt);
    if (cap == null) return false;
    const purchased = purchasedCountByTicketTypeId.get(tt.id) ?? 0;
    return purchased >= cap;
  };

  const handleQuantity = (tt: TicketType, delta: number) => {
    const avail = ticketStore$.availability[id][tt.id].get() ?? Math.max(0, Number(tt.availableQuantity ?? 0));
    if (avail <= 0 && delta > 0) return;

    const limit = maxAllowed(tt);
    const prev = selected;
    const isSame = prev?.ticketTypeId === tt.id;
    const nextQty = isSame
      ? Math.max(0, Math.min(limit, (prev?.quantity ?? 0) + delta))
      : delta > 0
        ? Math.min(limit, 1)
        : 0;

    if (nextQty <= 0) {
      if (prev?.ticketTypeId && (prev?.quantity ?? 0) > 0) {
        selectTicket(prev.ticketTypeId, -(prev.quantity ?? 0));
      }
      setSelected(null);
      saveDraft(id, []);
      return;
    }

    if (delta > 0 && prev && prev.ticketTypeId !== tt.id && (prev.quantity ?? 0) > 0) {
      selectTicket(prev.ticketTypeId, -(prev.quantity ?? 0));
    }
    selectTicket(tt.id, nextQty - (isSame ? (prev?.quantity ?? 0) : 0));

    setSelected({ ticketTypeId: tt.id, quantity: nextQty });
    saveDraft(id, [{ ticketTypeId: tt.id, quantity: nextQty }]);
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
            <Button className="mt-5 rounded-xl" onClick={() => setStep(1)}>
              Chọn vé
            </Button>
          </div>
        </main>
      );
    }

    return (
      <BookingConfirmContent
        event={event}
        selectedItems={selectedItems}
        selectedQuantity={selected?.quantity ?? 0}
        totalPrice={totalPrice}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={handleConfirm}
        onBack={() => setStep(1)}
        isPending={create.isPending}
      />
    );
  }

  return (
    <BookingContent
      eventId={id}
      event={event}
      ticketTypes={ticketTypes}
      selected={selected}
      totalPrice={totalPrice}
      maxPerUser={maxPerUser}
      maxAllowed={maxAllowed}
      hasReachedMax={hasReachedMax}
      onQuantityChange={handleQuantity}
      onGoToConfirm={handleGoToConfirm}
    />
  );
}
