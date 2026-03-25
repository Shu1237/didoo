"use client";

import Image from "next/image";
import { BadgeCheck, Share2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import type { Organizer } from "@/types/event";

const FALLBACK_LOGO = "https://i.pravatar.cc/240?u=organizer";

interface OrganizerProfileHeaderProps {
  organizer: Organizer;
  onShare: () => void;
}

export function OrganizerProfileHeader({
  organizer,
  onShare,
}: OrganizerProfileHeaderProps) {
  const joinedLabel = organizer.createdAt
    ? `Tham gia ${format(new Date(organizer.createdAt), "MMM yyyy", { locale: vi })}`
    : "";

  return (
    <div className="-mt-12 md:-mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between px-4 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-background bg-card shadow-xl md:h-36 md:w-36">
          <Image
            src={organizer.logoUrl || FALLBACK_LOGO}
            alt={organizer.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="pb-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
              {organizer.name}
            </h1>
            {organizer.isVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="h-4 w-4" />
                Đã xác minh
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            {organizer.address && `${organizer.address} • `}
            {joinedLabel}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button className="flex-1 sm:flex-initial rounded-xl font-bold h-11 px-8">Theo dõi</Button>
        <button
          type="button"
          onClick={onShare}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground shadow-sm"
          aria-label="Chia sẻ"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
