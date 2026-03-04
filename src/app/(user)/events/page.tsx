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

      <div id="events-grid" className="relative mx-auto -mt-6 w-full px-4 md:px-8 lg:px-12 xl:px-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-7xl space-y-4 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-2xl p-4 shadow-[0_40px_80px_-20px_rgba(14,165,233,0.15)] md:p-6"
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-sky-600/70" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search events, artists, workshops..."
                className="h-14 w-full rounded-full border border-white/80 bg-white/50 px-14 text-base font-medium text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 shadow-inner"
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
                Clear Filters
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="lg"
              onClick={() => setActiveCategory("all")}
              className={`h-11 rounded-full px-6 text-sm font-bold uppercase tracking-widest transition-all ${activeCategory === "all"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white/60 text-slate-600 hover:bg-white hover:text-slate-900"
                }`}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              All
            </Button>
            {visibleCategories.map((category) => (
              <Button
                key={category.id}
                size="lg"
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`h-11 rounded-full px-6 text-sm font-bold uppercase tracking-widest transition-all ${activeCategory === category.id
                    ? "bg-sky-600 text-white shadow-md border-transparent"
                    : "border-white/80 bg-white/60 text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-10 flex w-full flex-col gap-14 px-4 md:px-8 lg:px-12 xl:px-16">
        {filteredEvents.length === 0 ? (
          <div className="mx-auto max-w-7xl w-full rounded-3xl border border-dashed border-slate-300 bg-white/90 p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No events found</h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              Try changing your search terms or selecting a different category.
            </p>
            <Button
              className="mt-6 rounded-full px-6"
              onClick={() => {
                setKeyword("");
                setActiveCategory("all");
              }}
            >
              Reset Search
            </Button>
          </div>
        ) : (
          <>
            <EventsGrid
              title="Trending Now"
              icon={<TrendingUp className="h-4 w-4" />}
              description="The most searched and booked events this week."
              eventData={trendingEvents.length ? trendingEvents : filteredEvents.slice(0, 6)}
            />

            <EventsGrid
              title="Upcoming Events"
              icon={<CalendarDays className="h-4 w-4" />}
              description="Events happening very soon so you can schedule quickly."
              eventData={upcomingEvents}
            />

            {musicEvents.length > 0 && (
              <EventsGrid
                title="Featured Music"
                icon={<Music2 className="h-4 w-4" />}
                description="Our top picks for music, concerts, and live shows."
                eventData={musicEvents}
              />
            )}

            <div className="overflow-hidden mx-auto max-w-7xl w-full rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-sky-400/10 via-white/80 to-amber-300/10 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-sky-900/5 relative">
              {/* Decorative blurs */}
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-300/30 blur-[80px]" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-amber-300/20 blur-[80px]" />

              <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between z-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-sky-700 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5" />
                    Get Notified
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                    Never Miss an Event
                  </h3>
                  <p className="max-w-xl text-lg font-medium text-slate-600">
                    Subscribe for exclusive updates on new events, ticket prices, and secret venues before anyone else.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild className="h-14 rounded-full px-8 font-black uppercase tracking-widest text-sm shadow-xl shadow-sky-600/20 hover:shadow-sky-600/40 transition-all">
                    <Link href="/home">Go Home</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-14 rounded-full border-slate-300 bg-white/80 backdrop-blur-md px-8 text-slate-700 hover:bg-white font-black uppercase tracking-widest text-sm"
                  >
                    <Link href="/user/tickets">My Tickets</Link>
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
