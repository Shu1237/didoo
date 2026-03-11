"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetCategories, useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import BaseFilter, { FilterConfig } from "@/components/base/BaseFilter";
import { EventsPageHero } from "./_components/EventsPageHero";
import { EventsContent } from "./_components/EventsContent";

type SortBy = "featured" | "date" | "name";

export default function EventsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam && categoryIdParam.trim() ? categoryIdParam : "all";
  const startTimeParam = searchParams.get("startTime");
  const endTimeParam = searchParams.get("endTime");
  const sortBy = (searchParams.get("sortBy") as SortBy) ?? "featured";
  const pageNumber = Math.max(
    1,
    Number(searchParams.get("pageNumber") ?? searchParams.get("page") ?? 1)
  );
  const pageSize = Number(searchParams.get("pageSize") ?? 12);

  const query = useMemo(
    () => ({
      pageNumber,
      pageSize,
      hasCategory: true,
      hasOrganizer: true,
      hasLocations: true,
      isDeleted: false,
      ...(name && { name }),
      ...(categoryId !== "all" && { categoryId }),
      ...(startTimeParam && { startTime: startTimeParam }),
      ...(endTimeParam && { endTime: endTimeParam }),
      isDescending: true,
    }),
    [pageNumber, pageSize, name, categoryId, startTimeParam, endTimeParam]
  );

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents(query);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategories({ pageSize: 20 });

  const eventsData = eventsResponse?.data;
  const events = eventsData?.items ?? [];
  const totalItems = eventsData?.totalItems ?? 0;
  const totalPages = eventsData?.totalPages ?? 1;
  const currentPage = eventsData?.pageNumber ?? pageNumber;
  const itemsPerPage = eventsData?.pageSize ?? pageSize;

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (sortBy === "date") {
      result = [...result].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [events, sortBy]);

  const allCategories = categoriesResponse?.data.items ?? [];
  const filters: FilterConfig[] = [
    { key: "name", label: "Tìm kiếm", type: "text", placeholder: "Tên sự kiện..." },
    {
      key: "categoryId",
      label: "Danh mục",
      type: "select",
      options: [{ label: "Tất cả", value: "" }, ...allCategories.map((c) => ({ label: c.name, value: c.id }))],
    },
    { key: "startTime", label: "Ngày bắt đầu", type: "date" },
    { key: "endTime", label: "Ngày kết thúc", type: "date" },
  ];

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  if (isEventsLoading || isCategoriesLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <EventsPageHero
        totalEvents={totalItems}
        totalCategories={allCategories.length}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <BaseFilter filters={filters} />
        <EventsContent
          events={filteredEvents}
          sortBy={sortBy}
          onSortChange={(v) => updateParam("sortBy", v)}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={(p) => updateParam("pageNumber", String(p))}
          onPageSizeChange={(s) => updateParam("pageSize", String(s))}
          clearFiltersLink="/events"
          variant="events"
        />
      </div>
    </div>
  );
}
