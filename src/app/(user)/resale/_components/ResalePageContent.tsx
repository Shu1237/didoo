"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, Calendar, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  
  const [localName, setLocalName] = useState(searchParams.get("name") ?? "");
  const [localCategory, setLocalCategory] = useState(searchParams.get("categoryId") ?? "all");
  const [localStart, setLocalStart] = useState(searchParams.get("startTime") ?? "");
  const [localEnd, setLocalEnd] = useState(searchParams.get("endTime") ?? "");

  const sortBy = (searchParams.get("sortBy") as SortBy) ?? "featured";

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localName) params.set("name", localName); else params.delete("name");
    if (localCategory && localCategory !== "all") params.set("categoryId", localCategory); else params.delete("categoryId");
    if (localStart) params.set("startTime", localStart); else params.delete("startTime");
    if (localEnd) params.set("endTime", localEnd); else params.delete("endTime");
    params.set("pageNumber", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-20">
      <ResalePageHero totalEvents={totalItems} totalCategories={categories.length} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-10">
          <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col lg:flex-row items-end gap-4">
            <div className="flex flex-col sm:flex-row flex-1 w-full gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input 
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    placeholder="Tên sự kiện..."
                    className="pl-10 h-10 w-full"
                  />
                </div>
              </div>

              <div className="w-full lg:w-48 space-y-2">
                <label className="text-sm font-medium text-foreground">Danh mục</label>
                <Select value={localCategory} onValueChange={setLocalCategory}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full lg:w-44 space-y-2">
                <label className="text-sm font-medium text-foreground">Ngày bắt đầu</label>
                <Input 
                  type="date"
                  value={localStart}
                  onChange={(e) => setLocalStart(e.target.value)}
                  className="h-10"
                />
              </div>

              <div className="w-full lg:w-44 space-y-2">
                <label className="text-sm font-medium text-foreground">Ngày kết thúc</label>
                <Input 
                  type="date"
                  value={localEnd}
                  onChange={(e) => setLocalEnd(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>

            <Button 
              onClick={handleApplyFilters}
              variant="secondary"
              className="w-full lg:w-32 h-10"
            >
              Lọc
            </Button>
          </div>
        </section>

        <EventsContent
          events={events}
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
