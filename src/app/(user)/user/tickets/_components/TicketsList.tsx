"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Barcode from "react-barcode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import { useGetBookings } from "@/hooks/useBooking";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetMe } from "@/hooks/useUser";
import { Booking } from "@/types/booking";
import { ChevronLeft, ChevronRight, QrCode } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop";

function getStatusStyle(status: string) {
  const normalized = status?.toLowerCase() || "";
  if (normalized.includes("paid") || normalized.includes("success")) {
    return { label: "Đã thanh toán", className: "bg-[#00c98b] text-white" };
  }
  if (normalized.includes("pending")) {
    return { label: "Chờ thanh toán", className: "bg-amber-500 text-white" };
  }
  return { label: "Đã hủy", className: "bg-rose-500 text-white" };
}

export default function TicketsList() {
  const { data: userRes, isLoading: isUserLoading } = useGetMe();
  const user = userRes?.data;

  const { data: bookingsRes, isLoading: isBookingsLoading, isError } = useGetBookings(
    { userId: user?.id, pageNumber: 1, pageSize: 20, isDescending: true },
    { enabled: !!user?.id }
  );

  const bookings = bookingsRes?.data.items || [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", containScroll: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (isUserLoading || isBookingsLoading) return <Loading />;
  if (isError || !user || bookings.length === 0) return null; // Logic xử lý lỗi/trống đơn giản

  return (
    <div className="relative">
      <div className="overflow-hidden py-10" ref={emblaRef}>
        <div className="flex -ml-4 items-center touch-pan-y">
          {bookings.map((booking, index) => (
            <div
              key={booking.id}
              className={`min-w-0 shrink-0 grow-0 basis-[90%] sm:basis-[420px] pl-4 transition-all duration-500 ${index === selectedIndex ? "opacity-100 scale-100" : "opacity-40 scale-95"
                }`}
            >
              <BookingCard booking={booking} />
            </div>
          ))}
        </div>
      </div>

      {bookings.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-10 pointer-events-none z-20">
          <button
            onClick={scrollPrev}
            className="pointer-events-auto h-12 w-12 rounded-full bg-white/90 border border-slate-200 shadow-xl backdrop-blur-sm flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 active:scale-95 transition-all group"
          >
            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="pointer-events-auto h-12 w-12 rounded-full bg-white/90 border border-slate-200 shadow-xl backdrop-blur-sm flex items-center justify-center text-slate-800 hover:bg-white hover:scale-110 active:scale-95 transition-all group"
          >
            <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const { data: eventRes } = useGetEvent(booking.eventId);
  const event = eventRes?.data;
  const status = getStatusStyle(booking.status || "");

  const eventDate = event?.startTime ? new Date(event.startTime) : new Date();
  const dateStr = eventDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" }).replace(/\//g, ".");
  const timeStr = eventDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  const cardRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 420, h: 620 });

  useEffect(() => {
    if (!cardRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const { w, h } = dims;
  const inset = 1; // Slight inset to prevent clipping on edges
  const r = 48; // Corner radius (rounded-[3rem])
  const cr = 20; // Cutout radius
  const cp = 264; // Cutout center position

  const ticketPath = `
    M ${r + inset},${inset}
    H ${w - r - inset}
    A ${r},${r} 0 0 1 ${w - inset}, ${r + inset}
    V ${cp - cr}
    A ${cr},${cr} 0 0 0 ${w - inset}, ${cp + cr}
    V ${h - r - inset}
    A ${r},${r} 0 0 1 ${w - r - inset}, ${h - inset}
    H ${r + inset}
    A ${r},${r} 0 0 1 ${inset}, ${h - r - inset}
    V ${cp + cr}
    A ${cr},${cr} 0 0 0 ${inset}, ${cp - cr}
    V ${r + inset}
    A ${r},${r} 0 0 1 ${r + inset},${inset}
    Z
  `;

  return (
    <div className="relative group" ref={cardRef}>
      {/* SVG Border Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        <path
          d={ticketPath}
          fill="none"
          stroke="#d4d4d8" // zinc-300
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <article className="relative w-full overflow-hidden rounded-[3rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] [mask-image:radial-gradient(circle_20px_at_0_264px,transparent_98%,white),radial-gradient(circle_20px_at_100%_264px,transparent_98%,white)] [mask-composite:intersect]">
        {/* PHẦN TRÊN: ẢNH */}
        <div className="relative h-[240px] w-full">
          <Image
            src={event?.thumbnailUrl || event?.bannerUrl || FALLBACK_IMAGE}
            alt="Event"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          <Badge className={`absolute right-6 top-8 border-0 px-4 py-1.5 rounded-full font-bold shadow-lg ${status.className}`}>
            {status.label}
          </Badge>

          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center text-center px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80">Boarding Pass</p>
            <h3 className="mt-2 text-2xl font-bold text-white tracking-tight leading-tight uppercase">
              {event?.name || "Event Ticket"}
            </h3>
          </div>
        </div>

        {/* PHẦN KHOÉT LỖ & ĐƯỜNG CHIA */}
        <div className="relative h-12 w-full bg-white flex items-center justify-center">
          {/* Đường đứt đoạn nối giữa */}
          <div className="w-[85%] border-t-2 border-dashed border-zinc-200" />
        </div>

        {/* PHẦN DƯỚI: THÔNG TIN */}
        <div className="px-10 pb-12 pt-2 bg-white">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-y-8 mb-10">
            <DetailItem label="Booking ID" value={`#${booking.id?.substring(0, 8).toUpperCase()}`} />
            <DetailItem label="Date" value={dateStr} />
            <DetailItem label="Start Time" value={timeStr} />
            <DetailItem label="Total Price" value={`${Number(booking.totalPrice || 0).toLocaleString("vi-VN")}đ`} />
            <div className="col-span-2">
              <DetailItem label="Venue" value={event?.locations?.[0]?.name || "Online/TBD"} />
            </div>
          </div>

          {/* Barcode chuẩn ảnh mẫu */}
          <div className="flex flex-col items-center">
            <div className="w-full grayscale opacity-90 scale-x-110 mb-2">
              <Barcode
                value={booking.id || "000000"}
                width={1.6}
                height={55}
                displayValue={false}
                background="transparent"
                lineColor="#000"
                margin={0}
              />
            </div>
            <p className="text-[10px] font-mono font-bold text-slate-400 tracking-widest break-all text-center">
              {booking.id}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            <Button asChild variant="outline" className="flex-1 h-14 rounded-3xl border-slate-200 text-[#1d234d] font-bold text-base hover:bg-slate-50">
              <Link href={`/events/${booking.eventId}`}>Details</Link>
            </Button>
            <Button asChild className="flex-1 h-14 rounded-3xl bg-[#1d234d] hover:bg-[#2a3166] text-white font-bold text-base shadow-xl shadow-blue-900/20">
              <Link href={`/events/${booking.eventId}/booking/confirm?bookingId=${booking.id}`}>
                View Ticket
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</span>
      <span className="text-lg font-black text-[#1d234d] leading-tight">{value}</span>
    </div>
  );
}