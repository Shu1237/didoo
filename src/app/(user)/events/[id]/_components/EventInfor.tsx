"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Globe2, ShieldCheck, Tag } from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";
import { Button } from "@/components/ui/button";

interface EventInforProps {
  event: Event;
}

const FALLBACK_ORGANIZER_IMAGE = "https://i.pravatar.cc/240?u=organizer-profile";

function getStatusLabel(status: EventStatus) {
  if (status === EventStatus.PUBLISHED || status === EventStatus.OPENED) {
    return "Dang mo ban";
  }

  if (status === EventStatus.CLOSED) {
    return "Da dong";
  }

  if (status === EventStatus.CANCELLED) {
    return "Da huy";
  }

  return "Sap mo ban";
}

export default function EventInfor({ event }: EventInforProps) {
  const infoItems = [
    { label: "Danh muc", value: event.category?.name || "Su kien tong hop", icon: Tag },
    {
      label: "Do tuoi",
      value: event.ageRestriction > 0 ? `${event.ageRestriction}+` : "Moi lua tuoi",
      icon: ShieldCheck,
    },
    { label: "Trang thai", value: getStatusLabel(event.status), icon: Globe2 },
    { label: "Khung gio", value: `${event.openTime || "TBA"} - ${event.closedTime || "TBA"}`, icon: Clock3 },
  ];

  const timelineItems = [
    {
      label: "Ngay bat dau",
      value: event.startTime
        ? new Date(event.startTime).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Dang cap nhat",
    },
    {
      label: "Ngay ket thuc",
      value: event.endTime
        ? new Date(event.endTime).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Dang cap nhat",
    },
  ];

  return (
    <section className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-8">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Thong tin su kien
          </h2>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-700">
            {event.description}
          </p>
          {event.subtitle && (
            <p className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
              {event.subtitle}
            </p>
          )}
          {event.tags && event.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span
                  key={`${tag.tagName}-${index}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  #{tag.tagName}
                </span>
              ))}
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-xl font-bold text-slate-900">Thong tin nhanh</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <item.icon className="h-4 w-4 text-sky-600" />
                  <span>{item.label}</span>
                </div>
                <p className="mt-2 text-base font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {timelineItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <span className="rounded-full bg-sky-100 p-2 text-sky-700">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Nha to chuc</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-slate-200">
              <Image
                src={event.organizer?.logoUrl || FALLBACK_ORGANIZER_IMAGE}
                alt={event.organizer?.name || "Organizer"}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold text-slate-900">
                {event.organizer?.name || "Organizer"}
              </h3>
              <p className="text-sm text-slate-500">Thong tin don vi to chuc su kien</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            Don vi to chuc cung cap thong tin ve lich trinh, dia diem va huong dan check-in.
            Ban co the theo doi de nhan cap nhat som hon.
          </p>

          <div className="mt-6 space-y-3">
            <Button asChild className="h-11 w-full rounded-full">
              <Link href={`/organizers/${event.organizer?.id || ""}`}>Xem trang organizer</Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            >
              Theo doi
            </Button>
          </div>
        </div>
      </aside>
    </section>
  );
}
