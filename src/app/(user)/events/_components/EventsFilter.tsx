"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  CalendarDays,
  LayoutGrid,
  Music2,
  Search,
  Tag,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Category } from "@/types/category";

export type DateFilter = "all" | "today" | "tomorrow" | "weekend" | "custom";

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "today", label: "Hôm nay" },
  { value: "tomorrow", label: "Ngày mai" },
  { value: "weekend", label: "Cuối tuần" },
  { value: "custom", label: "Tùy chọn" },
];

const EVENT_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "online", label: "Trực tuyến" },
  { value: "inperson", label: "Trực tiếp" },
];

function getStartTimeForDateFilter(dateFilter: DateFilter, customDate: Date | undefined): string | null {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (dateFilter === "today") return format(today, "yyyy-MM-dd");
  if (dateFilter === "tomorrow") return format(new Date(today.getTime() + 86400000), "yyyy-MM-dd");
  if (dateFilter === "custom" && customDate) return format(customDate, "yyyy-MM-dd");
  return null;
}

interface EventsFilterProps {
  categories: Category[];
}

export default function EventsFilter({ categories }: EventsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("name") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "all";
  const dateFilter = (searchParams.get("dateFilter") as DateFilter) ?? "all";
  const startTimeParam = searchParams.get("startTime");
  const customDate = startTimeParam ? new Date(startTimeParam) : undefined;
  const eventType = searchParams.get("eventType") ?? "all";

  const [localKeyword, setLocalKeyword] = useState(keyword);

  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const updateParam = useCallback(
    (updates: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          p.delete(key);
        } else {
          p.set(key, value);
        }
      });
      if (!updates.pageNumber && !updates.page) {
        p.set("pageNumber", "1");
      }
      router.push(`${pathname}?${p.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleKeywordChange = (v: string) => {
    setLocalKeyword(v);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== keyword) {
        updateParam({ name: localKeyword || null });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localKeyword]);

  const handleCategoryChange = (v: string) => {
    updateParam({ categoryId: v === "all" ? null : v });
  };

  const handleDateFilterChange = (v: DateFilter) => {
    if (v === "custom") {
      updateParam({ dateFilter: v, startTime: null });
    } else {
      const st = getStartTimeForDateFilter(v, undefined);
      updateParam({ dateFilter: v, startTime: st });
    }
  };

  const handleCustomDateChange = (d: Date | undefined) => {
    if (d) {
      updateParam({ startTime: format(d, "yyyy-MM-dd") });
    } else {
      updateParam({ startTime: null });
    }
  };

  const handleEventTypeChange = (v: string) => {
    updateParam({ eventType: v === "all" ? null : v });
  };

  const handleClear = () => {
    router.push(pathname);
    setLocalKeyword("");
  };

  const hasFilters =
    localKeyword.trim().length > 0 ||
    categoryId !== "all" ||
    dateFilter !== "all" ||
    eventType !== "all";

  return (
    <aside className="w-full lg:w-72 shrink-0 lg:self-stretch flex flex-col">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm flex-1 min-h-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Bộ lọc</h3>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 text-xs text-zinc-500 hover:text-primary"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Xóa lọc
            </Button>
          )}
        </div>

        <div className="space-y-2 mb-6">
          <label className="text-xs font-semibold text-zinc-600">Tìm kiếm</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              value={localKeyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              placeholder="Sự kiện, nghệ sĩ..."
              className="h-10 pl-9 rounded-xl border-zinc-200 bg-zinc-50"
            />
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
            <Tag className="h-3.5 w-3.5" />
            Danh mục
          </label>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors",
                categoryId === "all" ? "bg-primary text-white" : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" />
              Tất cả
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-colors",
                  categoryId === cat.id ? "bg-primary text-white" : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <Music2 className="h-4 w-4 shrink-0" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <label className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
            <CalendarIcon className="h-3.5 w-3.5" />
            Thời gian
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  handleDateFilterChange(opt.value);
                  if (opt.value !== "custom") handleCustomDateChange(undefined);
                }}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  dateFilter === opt.value ? "bg-primary text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {dateFilter === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-10 justify-start rounded-xl border-zinc-200 bg-zinc-50 text-sm font-normal",
                    !customDate && "text-zinc-500"
                  )}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {customDate ? format(customDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                <Calendar
                  mode="single"
                  selected={customDate}
                  onSelect={(d) => handleCustomDateChange(d ?? undefined)}
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-600">Loại sự kiện</label>
          <div className="flex flex-col gap-1">
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors",
                  eventType === opt.value ? "bg-zinc-100" : "hover:bg-zinc-50"
                )}
              >
                <input
                  type="radio"
                  name="eventType"
                  value={opt.value}
                  checked={eventType === opt.value}
                  onChange={() => handleEventTypeChange(opt.value)}
                  className="h-4 w-4 text-primary border-zinc-300 focus:ring-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
