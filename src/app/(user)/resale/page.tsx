"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Search, RefreshCw } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { UserPagination } from "@/components/base/UserPagination";
import EventsFilter from "../events/_components/EventsFilter";
import { Event } from "@/types/event";

type DateFilter = "all" | "today" | "tomorrow" | "weekend" | "custom";
type SortBy = "featured" | "date" | "name";

function filterByDate(events: Event[], dateFilter: DateFilter, customDate: Date | undefined): Event[] {
  if (dateFilter === "all") return events;
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.filter((e) => {
    const start = new Date(e.startTime);
    if (dateFilter === "today") return isSameDay(start, todayStart);
    if (dateFilter === "tomorrow") return isSameDay(start, addDays(todayStart, 1));
    if (dateFilter === "weekend") {
      const day = start.getDay();
      return day === 0 || day === 6;
    }
    if (dateFilter === "custom" && customDate) return isSameDay(start, customDate);
    return true;
  });
}

function filterByEventType(events: Event[], type: string): Event[] {
  if (type === "all") return events;
  return events.filter((e) => {
    const loc = e.locations?.[0];
    const name = (loc?.name || "").toLowerCase();
    const addr = (loc?.address || "").toLowerCase();
    const isOnline = name.includes("online") || addr.includes("online") || addr.includes("trực tuyến");
    if (type === "online") return isOnline;
    if (type === "inperson") return !isOnline;
    return true;
  });
}

export default function ResalePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "all";
  const dateFilter = (searchParams.get("dateFilter") as DateFilter) ?? "all";
  const startTimeParam = searchParams.get("startTime");
  const customDate = startTimeParam ? new Date(startTimeParam) : undefined;
  const eventType = searchParams.get("eventType") ?? "all";
  const sortBy = (searchParams.get("sortBy") as SortBy) ?? "featured";
  const pageNumber = Math.max(1, Number(searchParams.get("pageNumber") ?? searchParams.get("page") ?? 1));
  const pageSize = Number(searchParams.get("pageSize") ?? 12);

  const query = useMemo(
    () => ({
      pageNumber,
      pageSize,
      hasCategory: true,
      hasOrganizer: true,
      hasLocations: true,
      ...(name && { name }),
      ...(categoryId !== "all" && { categoryId }),
      ...(startTimeParam && { startTime: startTimeParam }),
      isDescending: true,
    }),
    [pageNumber, pageSize, name, categoryId, startTimeParam]
  );

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents(query);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories({
    pageSize: 20,
  });

  const eventsData = eventsResponse?.data;
  const events = eventsData?.items ?? [];
  const totalItems = eventsData?.totalItems ?? 0;
  const totalPages = eventsData?.totalPages ?? 1;
  const currentPage = eventsData?.pageNumber ?? pageNumber;
  const itemsPerPage = eventsData?.pageSize ?? pageSize;

  const filteredEvents = useMemo(() => {
    let result = filterByDate(events, dateFilter, customDate);
    result = filterByEventType(result, eventType);

    if (sortBy === "date") {
      result = [...result].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [events, dateFilter, customDate, eventType, sortBy]);

  const allCategories = categoriesResponse?.data.items ?? [];

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  if (isEventsLoading || isCategoriesLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <section className="relative overflow-hidden px-4 pt-12 pb-12">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px]" />
          <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-primary/5 blur-[80px]" />
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 mb-4">
            <RefreshCw className="h-4 w-4" />
            Vé bán lại
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">Vé bán lại sự kiện</h1>
          <p className="mt-2 text-zinc-600">
            {totalItems} sự kiện • {allCategories.length} danh mục
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr] gap-8">
          <div className="lg:sticky lg:top-24 h-full">
            <EventsFilter categories={allCategories} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-zinc-900">{filteredEvents.length} sự kiện</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => updateParam("sortBy", e.target.value)}
                  className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/5"
                >
                  <option value="featured">Nổi bật</option>
                  <option value="date">Theo ngày</option>
                  <option value="name">Theo tên</option>
                </select>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-16 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-zinc-400" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">Không tìm thấy sự kiện</h2>
                <p className="mt-2 text-zinc-600">Thử thay đổi bộ lọc hoặc từ khóa.</p>
                <Button asChild className="mt-6 rounded-xl">
                  <Link href="/resale">Xóa bộ lọc</Link>
                </Button>
              </div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link
                        href={`/events/${event.id}`}
                        className="block rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 group"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={
                              event.thumbnailUrl ||
                              event.bannerUrl ||
                              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800"
                            }
                            alt={event.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/20 to-transparent" />
                          <span className="absolute top-3 left-3 rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                            Vé bán lại
                          </span>
                          <span className="absolute top-3 left-[4.5rem] rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                            {event.category?.name || "Sự kiện"}
                          </span>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 text-xs text-zinc-200 mb-2">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {format(new Date(event.startTime), "EEE, dd MMM • HH:mm", { locale: vi })}
                            </div>
                            <h3 className="text-lg font-bold text-white line-clamp-2">{event.name}</h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-300">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="line-clamp-1">
                                {event.locations?.[0]?.name || event.locations?.[0]?.address || "TBA"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm font-semibold text-zinc-900">Xem chi tiết</span>
                          <span className="inline-flex items-center justify-center rounded-xl h-9 px-4 bg-amber-500 text-white text-sm font-semibold group-hover:bg-amber-600 transition-colors">
                            50 vé còn lại
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                {(totalPages > 1 || totalItems > pageSize) && (
                  <div className="mt-10 py-6 border-t border-zinc-200">
                    <UserPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      itemsPerPage={itemsPerPage}
                      onPageChange={(p) => updateParam("pageNumber", String(p))}
                      onPageSizeChange={(s) => updateParam("pageSize", String(s))}
                      pageSizeOptions={[9, 12, 18, 24]}
                    />
                  </div>
                )}

                <div className="mt-16 rounded-2xl border border-zinc-200 bg-gradient-to-br from-amber-500/5 via-white to-amber-500/5 p-8 sm:p-12 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900">Mua vé bán lại an toàn</h3>
                      <p className="mt-2 text-zinc-600 max-w-xl">
                        Tìm vé sự kiện từ người bán uy tín. Đảm bảo giao dịch an toàn, minh bạch.
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <Button asChild className="rounded-xl">
                        <Link href="/events">Xem sự kiện</Link>
                      </Button>
                      <Button asChild variant="outline" className="rounded-xl border-zinc-200">
                        <Link href="/user/dashboard/tickets">Vé của tôi</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
