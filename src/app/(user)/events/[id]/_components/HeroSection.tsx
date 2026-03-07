"use client";

import Image from "next/image";
import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { Share2 } from "lucide-react";
import { Event } from "@/types/event";
import { toast } from "sonner";

interface HeroSectionProps {
  event: Event;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2070&auto=format&fit=crop";

export default function HeroSection({ event }: HeroSectionProps) {
  const startDate = event.startTime ? new Date(event.startTime) : null;
  const endDate = event.endTime ? new Date(event.endTime) : null;

  const dateLabel =
    startDate && isValid(startDate)
      ? endDate && isValid(endDate) && startDate.getTime() !== endDate.getTime()
        ? `${format(startDate, "dd MMM", { locale: vi })} - ${format(endDate, "dd MMM yyyy", { locale: vi })}`
        : format(startDate, "dd MMM yyyy", { locale: vi })
      : "Đang cập nhật";

  const locationLabel =
    event.locations?.[0]?.name || event.locations?.[0]?.address || "Địa điểm TBA";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.name, url: window.location.href });
        toast.success("Đã chia sẻ");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép link");
      }
    } catch {
      toast.info("Đã hủy chia sẻ");
    }
  };

  return (
    <section className="relative h-[420px] md:h-[520px] w-full overflow-hidden">
      <Image
        src={event.bannerUrl || event.thumbnailUrl || FALLBACK_IMAGE}
        alt={event.name}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/95 via-zinc-900/50 to-zinc-900/30" />

      <button
        type="button"
        onClick={handleShare}
        className="absolute right-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/30 md:right-10 md:top-10"
        aria-label="Chia sẻ"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {/* Badge top-left */}
      <div className="absolute left-6 top-6 md:left-10 md:top-10">
        <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
          {event.category?.name || "Sự kiện"}
        </span>
      </div>

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
          {event.name}
        </h1>
        <p className="mt-4 text-base text-white/90 md:text-lg">
          {dateLabel} • {locationLabel}
        </p>
      </div>
    </section>
  );
}
