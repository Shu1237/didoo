"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, CalendarDays, Loader2, Ticket as TicketIcon } from "lucide-react";
import { useGetMe } from "@/hooks/useAuth";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetTicketListings, useGetTickets, useTicketListing } from "@/hooks/useTicket";
import { ticketListingCreateSchema } from "@/schemas/ticket";
import Loading from "@/components/loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { handleErrorApi } from "@/lib/errors";
import { EventStatus, TicketListingStatus } from "@/utils/enum";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop";

const createListingFormSchema = ticketListingCreateSchema.pick({
  ticketIds: true,
  askingPrice: true,
  description: true,
});

type FormValues = z.input<typeof createListingFormSchema>;

function isReadyTicket(status: string | number | undefined) {
  const raw = String(status ?? "").toLowerCase();
  return raw === "1" || raw.includes("ready") || raw.includes("available");
}

export default function CreateResalePage() {
  const router = useRouter();
  const { data: meRes, isLoading: isMeLoading } = useGetMe();
  const user = meRes?.data;

  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const { data: eventsRes, isLoading: isEventsLoading } = useGetEvents(
    {
      pageNumber: 1,
      pageSize: 100,
      hasLocations: true,
      isDescending: true,
      status: EventStatus.PUBLISHED,
    },
    true
  );

  const { data: ticketsRes, isLoading: isTicketsLoading } = useGetTickets(
    {
      ownerId: user?.id,
      pageNumber: 1,
      pageSize: 300,
      isDescending: true,
      hasEvent: true,
      hasType: true,
    },
    { enabled: !!user?.id }
  );

  const { data: listingsRes, isLoading: isListingsLoading } = useGetTicketListings(
    { sellerUserId: user?.id, pageNumber: 1, pageSize: 300, isDescending: true },
    { enabled: !!user?.id }
  );

  const { create } = useTicketListing();

  const form = useForm<FormValues>({
    resolver: zodResolver(createListingFormSchema),
    defaultValues: {
      ticketIds: [],
      askingPrice: 0,
      description: "",
    },
  });

  const activeListingTicketIds = useMemo(() => {
    const listings = listingsRes?.data.items || [];
    const set = new Set<string>();
    for (const listing of listings) {
      const status = Number(listing.status ?? 0);
      if (status !== TicketListingStatus.PENDING && status !== TicketListingStatus.SOLD && listing.ticketId) set.add(listing.ticketId);
    }
    return set;
  }, [listingsRes?.data.items]);

  const candidateTickets = useMemo(() => {
    const tickets = ticketsRes?.data.items || [];
    return tickets.filter((ticket) => isReadyTicket(ticket.status) && !activeListingTicketIds.has(ticket.id));
  }, [ticketsRes?.data.items, activeListingTicketIds]);

  const ownedCountByEvent = useMemo(() => {
    const map = new Map<string, number>();
    for (const ticket of candidateTickets) {
      const eventId = ticket.event?.id;
      if (!eventId) continue;
      map.set(eventId, (map.get(eventId) || 0) + 1);
    }
    return map;
  }, [candidateTickets]);

  const currentEvents = useMemo(() => {
    const all = eventsRes?.data.items || [];
    return all.filter((e) => (ownedCountByEvent.get(e.id) || 0) > 0);
  }, [eventsRes?.data.items, ownedCountByEvent]);
  const selectedEvent = currentEvents.find((e) => e.id === selectedEventId);
  const selectedTicketIds = form.watch("ticketIds") || [];

  const ticketsOfSelectedEvent = useMemo(() => {
    if (!selectedEventId) return [];
    return candidateTickets.filter((ticket) => (ticket.event?.id || "") === selectedEventId);
  }, [candidateTickets, selectedEventId]);

  const hasOwnedTicketsForSelectedEvent = ticketsOfSelectedEvent.length > 0;

  const toggleTicket = (ticketId: string) => {
    const current = form.getValues("ticketIds") || [];
    const exists = current.includes(ticketId);
    if (exists) {
      form.setValue(
        "ticketIds",
        current.filter((id) => id !== ticketId),
        { shouldDirty: true, shouldValidate: true }
      );
      return;
    }
    form.setValue("ticketIds", [...current, ticketId], { shouldDirty: true, shouldValidate: true });
  };

  const chooseMany = () => {
    if (!selectedEventId) {
      toast.error("Vui lòng chọn sự kiện trước.");
      return;
    }
    form.setValue(
      "ticketIds",
      ticketsOfSelectedEvent.map((t) => t.id),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const clearAll = () => {
    form.setValue("ticketIds", [], { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    if (!user?.id) return;
    if (!selectedEventId) {
      toast.error("Vui lòng chọn sự kiện.");
      return;
    }
    if (!hasOwnedTicketsForSelectedEvent) {
      toast.error("Bạn chưa có vé phù hợp của sự kiện này để đăng bán.");
      return;
    }
    try {
      const selectedTickets = ticketsOfSelectedEvent.filter((ticket) => values.ticketIds.includes(ticket.id));
      if (selectedTickets.length === 0) {
        form.setError("ticketIds", { message: "Vui lòng chọn ít nhất một vé." });
        return;
      }

      const payload = ticketListingCreateSchema.parse({
        ticketIds: values.ticketIds,
        sellerUserId: user.id,
        askingPrice: Number(values.askingPrice),
        description: values.description?.trim() || undefined,
      });

      await create.mutateAsync(payload);
      toast.success("Đăng vé bán lại thành công.");
      router.push("/user/dashboard/resales");
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  if (isMeLoading || isEventsLoading || isTicketsLoading || isListingsLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Đăng vé bán lại</h1>
          <p className="mt-1 text-zinc-600">Vui lòng chọn vé bạn muốn bán lại và nhập giá bán mong muốn.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/user/dashboard/resales">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
      </div>

      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-900">Các sự kiện hiện tại</h2>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentEvents.length === 0 ? (
            <p className="text-sm text-zinc-600">Bạn chưa có vé phù hợp của sự kiện nào để đăng bán lại.</p>
          ) : (
            currentEvents.map((event) => {
              const ownedCount = ownedCountByEvent.get(event.id) || 0;
              const isActive = selectedEventId === event.id;
              return (
                <div key={event.id} className={`overflow-hidden rounded-2xl border ${isActive ? "border-primary" : "border-zinc-200"}`}>
                  <div className="grid gap-0 md:grid-cols-[1fr_220px]">
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Sự kiện hiện tại</p>
                      <p className="mt-1 text-xl font-semibold text-zinc-900">{event.name}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-zinc-600">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(event.startTime).toLocaleString("vi-VN")}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Badge variant="outline">{ownedCount} vé đủ điều kiện</Badge>
                        <Button
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          onClick={() => {
                            setSelectedEventId(event.id);
                            form.setValue("ticketIds", [], { shouldDirty: true, shouldValidate: true });
                          }}
                        >
                          Chọn sự kiện
                        </Button>
                      </div>
                    </div>
                    <div className="relative min-h-[140px]">
                      <Image
                        src={event.thumbnailUrl || event.bannerUrl || FALLBACK_IMAGE}
                        alt={event.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-900">Vé của tôi</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedEventId ? (
            <p className="text-sm text-zinc-600">Vui lòng chọn sự kiện để hiển thị vé của bạn.</p>
          ) : !hasOwnedTicketsForSelectedEvent ? (
            <p className="text-sm text-rose-600">Bạn chưa mua vé phù hợp của sự kiện này hoặc vé đã dùng/hết điều kiện đăng bán.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={chooseMany}>
                  Chọn nhiều
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={clearAll}>
                  Xóa tất cả
                </Button>
              </div>

              <div className="space-y-3">
                {ticketsOfSelectedEvent.map((ticket) => {
                  const checked = selectedTicketIds.includes(ticket.id);
                  const shortId = `#TKT-${ticket.id.replace(/-/g, "").slice(-6)}`;
                  return (
                    <label
                      key={ticket.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-3 transition-all hover:shadow-sm ${checked ? "border-primary bg-primary/5" : "border-zinc-200 bg-white hover:border-zinc-300"}`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                        <TicketIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-medium text-zinc-900">ID: {shortId}</p>
                        <p className="text-xs text-zinc-600">Hạng vé: {ticket.ticketType?.name || "N/A"}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="bg-emerald-500/90 text-[10px] font-medium text-white">
                            CÓ SẴN
                          </Badge>
                          <span className="text-xs text-zinc-600">
                            Giá gốc: {Number(ticket.ticketType?.price || 0).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Checkbox checked={checked} onCheckedChange={() => toggleTicket(ticket.id)} />
                      </div>
                    </label>
                  );
                })}
              </div>
            </>
          )}

          {form.formState.errors.ticketIds?.message ? (
            <p className="text-sm text-rose-600">{String(form.formState.errors.ticketIds.message)}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-xl font-semibold text-zinc-900">Thông tin bán lại</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Giá bán mong muốn (VNĐ)</label>
            <Input
              type="number"
              min={0}
              value={form.watch("askingPrice") ?? 0}
              onChange={(e) => form.setValue("askingPrice", Number(e.target.value || 0), { shouldDirty: true, shouldValidate: true })}
            />
            {form.formState.errors.askingPrice?.message ? (
              <p className="text-sm text-rose-600">{String(form.formState.errors.askingPrice.message)}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Mô tả (tuỳ chọn)</label>
            <Textarea
              rows={3}
              value={form.watch("description") || ""}
              onChange={(e) => form.setValue("description", e.target.value, { shouldDirty: true, shouldValidate: true })}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              className="flex-1"
              onClick={form.handleSubmit(onSubmit)}
              disabled={create.isPending || !selectedEventId || !hasOwnedTicketsForSelectedEvent || selectedTicketIds.length === 0}
            >
              {create.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng...
                </>
              ) : (
                "Đăng bán vé ngay"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={clearAll}>
              Hủy bỏ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
