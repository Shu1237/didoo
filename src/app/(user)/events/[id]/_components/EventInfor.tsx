"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Globe2, ShieldCheck, Tag } from "lucide-react";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";
import { useGetOrganizer } from "@/hooks/useOrganizer";
import { Button } from "@/components/ui/button";

interface EventInforProps {
  event: Event;
}

const FALLBACK_ORGANIZER_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop";

function getStatusLabel(status: EventStatus) {
  if (status === EventStatus.PUBLISHED || status === EventStatus.OPENED) {
    return "Open";
  }

  if (status === EventStatus.CLOSED) {
    return "Closed";
  }

  if (status === EventStatus.CANCELLED) {
    return "Cancelled";
  }

  return "Coming Soon";
}

export default function EventInfor({ event }: EventInforProps) {
  const infoItems = [
    { label: "Category", value: event.category?.name || "General Event", icon: Tag },
    {
      label: "Age",
      value: event.ageRestriction > 0 ? `${event.ageRestriction}+` : "All Ages",
      icon: ShieldCheck,
    },
    { label: "Status", value: getStatusLabel(event.status), icon: Globe2 },
    { label: "Timeframe", value: `${event.openTime || "TBA"} - ${event.closedTime || "TBA"}`, icon: Clock3 },
  ];

  const timelineItems = [
    {
      label: "Start Date",
      value: event.startTime
        ? new Date(event.startTime).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "Updating",
    },
    {
      label: "End Date",
      value: event.endTime
        ? new Date(event.endTime).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "Updating",
    },
  ];

  const orgId = event.organizer?.id;
  const { data: orgDataResponse } = useGetOrganizer(orgId || "");
  const organizerDetails = orgDataResponse?.data;

  const orgImage = organizerDetails?.bannerUrl || organizerDetails?.logoUrl || event.organizer?.logoUrl || FALLBACK_ORGANIZER_IMAGE;

  return (
    <section className="grid gap-12 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-8">
        <article className="space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Event Information
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

        <article className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest text-slate-400">Quick Facts</h3>
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

      <aside className="lg:col-span-4 pl-0 lg:pl-10">
        <div className="sticky top-24 pt-6 space-y-6">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">Organizer</p>

          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1">
            {/* Banner Area */}
            <div className="relative h-32 w-full overflow-hidden">
              <Image
                src={orgImage}
                alt={organizerDetails?.name || event.organizer?.name || "Organizer"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content Area */}
            <div className="relative px-6 pb-6 pt-4">
              {/* Floating Logo if available, else just title */}
              {organizerDetails?.logoUrl && organizerDetails.logoUrl !== orgImage && (
                <div className="absolute -top-10 left-6 h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                  <Image
                    src={organizerDetails.logoUrl}
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className={organizerDetails?.logoUrl && organizerDetails.logoUrl !== orgImage ? "mt-4" : ""}>
                <h3 className="text-xl font-black text-slate-900 line-clamp-1">
                  {organizerDetails?.name || event.organizer?.name || "Organizer"}
                </h3>
                {organizerDetails?.isVerified && (
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 line-clamp-3">
                {organizerDetails?.description || "The organizer provides schedule, location and check-in instructions. Follow them to receive updates sooner."}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Button asChild className="h-12 w-full rounded-2xl font-black tracking-widest uppercase text-[10px] shadow-md shadow-slate-900/10">
                  <Link href={`/organizers/${event.organizer?.id || ""}`}>View Profile</Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-slate-200 bg-slate-50 text-slate-700 hover:bg-white font-black tracking-widest uppercase text-[10px]"
                >
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
