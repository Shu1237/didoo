"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BaseFilter, { FilterConfig } from "@/components/base/BaseFilter";
import { EventsContent } from "../../events/_components/EventsContent";
import { ResalePageHero } from "./ResalePageHero";
import type { Event, Category } from "@/types/event";

type SortBy = "featured" | "date" | "name";

interface ResalePageContentProps {
  events: Event[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  categories: Category[];
}

export function ResalePageContent({
  events,
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  categories,
}: ResalePageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortBy = (searchParams.get("sortBy") as SortBy) ?? "featured";

  const filteredEvents = useMemo(() => {
    let result = [...events];

    if (sortBy === "date") {
      result = [...result].sort(
        (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    } else if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [events, sortBy]);

  const filters: FilterConfig[] = [
    { key: "name", label: "Tìm kiếm", type: "text", placeholder: "Tên sự kiện..." },
    {
      key: "categoryId",
      label: "Danh mục",
      type: "select",
      options: [{ label: "Tất cả", value: "" }, ...categories.map((c) => ({ label: c.name, value: c.id }))],
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

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <ResalePageHero totalEvents={totalItems} totalCategories={categories.length} />

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
          clearFiltersLink="/resale"
          variant="resale"
        />
      </div>
    </div>
  );
}
