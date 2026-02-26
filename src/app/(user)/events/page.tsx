"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  LayoutGrid,
  Music2,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import EventsHero from "./_components/EventsHero";
import EventsGrid from "./_components/EventsGrid";

export default function EventsPage() {
  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents({
    pageSize: 30,
    isDescending: true,
  });
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();

  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  if (isEventsLoading || isCategoriesLoading) return <Loading />;

  const events = eventsResponse?.data.items || [];
  const allCategories = categoriesResponse?.data.items || [];

  const visibleCategories = allCategories.slice(0, 6);
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredEvents = events.filter((event) => {
    const matchesCategory = activeCategory === "all" || event.category?.id === activeCategory;
    const matchesKeyword =
      !normalizedKeyword ||
      event.name.toLowerCase().includes(normalizedKeyword) ||
      (event.subtitle || "").toLowerCase().includes(normalizedKeyword) ||
      (event.description || "").toLowerCase().includes(normalizedKeyword);

    return matchesCategory && matchesKeyword;
  });

  const featuredEvent = filteredEvents[0];
  const trendingEvents = filteredEvents.slice(1, 7);
  const upcomingEvents = [...filteredEvents]
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .slice(0, 6);
  const musicEvents = filteredEvents
    .filter((event) => {
      const categoryName = event.category?.name?.toLowerCase() || "";
      return categoryName.includes("music") || categoryName.includes("nhac");
    })
    .slice(0, 6);

  const hasFilters = keyword.trim().length > 0 || activeCategory !== "all";

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <EventsHero
        featuredEvent={featuredEvent}
        totalEvents={events.length}
        totalCategories={allCategories.length}
      />

      <div className="relative mx-auto -mt-2 w-full max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_40px_-34px_rgba(15,23,42,0.4)] md:p-6"
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tim su kien, artist, workshop..."
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-11 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </label>

            {hasFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  setKeyword("");
                  setActiveCategory("all");
                }}
                className="h-11 rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              >
                Xoa bo loc
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              onClick={() => setActiveCategory("all")}
              className="h-9 rounded-full px-4"
            >
              <LayoutGrid className="h-4 w-4" />
              Tat ca
            </Button>
            {visibleCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="h-9 rounded-full px-4"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col gap-14 px-4">
        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/90 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Khong tim thay su kien</h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              Thu doi tu khoa hoac chon danh muc khac de xem them su kien phu hop.
            </p>
            <Button
              className="mt-6 rounded-full px-6"
              onClick={() => {
                setKeyword("");
                setActiveCategory("all");
              }}
            >
              Xem lai tat ca
            </Button>
          </div>
        ) : (
          <>
            <EventsGrid
              title="Dang duoc quan tam"
              icon={<TrendingUp className="h-4 w-4" />}
              description="Nhung su kien duoc tim kiem va dat ve nhieu trong tuan nay."
              eventData={trendingEvents.length ? trendingEvents : filteredEvents.slice(0, 6)}
            />

            <EventsGrid
              title="Sap dien ra"
              icon={<CalendarDays className="h-4 w-4" />}
              description="Danh sach su kien gan ngay nhat de ban len lich nhanh."
              eventData={upcomingEvents}
            />

            {musicEvents.length > 0 && (
              <EventsGrid
                title="Am nhac noi bat"
                icon={<Music2 className="h-4 w-4" />}
                description="Goi y cac dem nhac, concert va mini show dang mo ban."
                eventData={musicEvents}
              />
            )}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-100 via-white to-amber-100 p-6 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Nhan thong bao moi
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    Theo doi su kien moi phu hop voi ban
                  </h3>
                  <p className="max-w-2xl text-slate-600">
                    Nhan cap nhat ve su kien moi, gia ve va dia diem de khong bo lo co hoi.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="h-11 rounded-full px-6">
                    <Link href="/home">Ve trang chu</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-full border-slate-300 bg-white/90 px-6 text-slate-700"
                  >
                    <Link href="/user/tickets">Xem ve cua toi</Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
