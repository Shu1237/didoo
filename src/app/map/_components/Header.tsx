"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowUpDown, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useGetCategories } from "@/hooks/useCategory";

const sortOptions = [
  { label: "Ngày diễn ra", value: "date" as const },
  { label: "Khoảng cách", value: "distance" as const },
  { label: "Mới nhất", value: "price" as const },
];

export default function MapHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const sortBy = (searchParams.get("sortBy") as "date" | "distance" | "price") ?? "date";
  const startTime = searchParams.get("startTime") ?? "";
  const endTime = searchParams.get("endTime") ?? "";

  const { data: categoriesRes } = useGetCategories({ pageSize: 50 });
  const categories = categoriesRes?.data?.items ?? [];

  const updateParams = (updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === "" || v === "all") p.delete(k);
      else p.set(k, v);
    });
    p.delete("pageNumber");
    router.push(`/map?${p.toString()}`);
  };

  const [searchInput, setSearchInput] = useState(name);
  useEffect(() => setSearchInput(name), [name]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    updateParams({ name: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onBlur={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch((e.target as HTMLInputElement).value)}
            placeholder="Tìm sự kiện, địa điểm..."
            className="pl-9 h-10 rounded-xl bg-background/50 border-border/50 hover:bg-background/80 hover:border-primary/30 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`h-10 px-3 rounded-xl border-border/50 ${
                categoryId ? "bg-primary/10 border-primary/30 text-primary" : "bg-background/50 hover:bg-background/80"
              }`}
            >
              <span className="truncate text-sm font-medium mr-2 hidden sm:inline">
                {categoryId ? categories.find((c) => c.id === categoryId)?.name ?? "Danh mục" : "Danh mục"}
              </span>
              <Filter className="w-3.5 h-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 overflow-hidden rounded-xl border-border/50 backdrop-blur-xl bg-background/95">
            <DropdownMenuItem
              onClick={() => updateParams({ categoryId: "" })}
              className={`focus:bg-primary/10 focus:text-primary cursor-pointer my-1 rounded-lg ${!categoryId ? "text-primary font-medium bg-primary/5" : ""}`}
            >
              Tất cả danh mục
            </DropdownMenuItem>
            {categories.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => updateParams({ categoryId: c.id })}
                className={`focus:bg-primary/10 focus:text-primary cursor-pointer my-1 rounded-lg ${categoryId === c.id ? "text-primary font-medium bg-primary/5" : ""}`}
              >
                {c.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl border-border/50 bg-background/50 hover:bg-background/80 hover:text-primary transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 overflow-hidden rounded-xl border-border/50 backdrop-blur-xl bg-background/95">
            {sortOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => updateParams({ sortBy: opt.value })}
                className={`focus:bg-primary/10 focus:text-primary cursor-pointer my-1 rounded-lg ${
                  sortBy === opt.value ? "text-primary font-medium bg-primary/5" : ""
                }`}
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Input
            type="date"
            value={startTime}
            onChange={(e) => updateParams({ startTime: e.target.value })}
            className="h-9 text-xs rounded-lg bg-background/50 border-border/50 w-[130px]"
            placeholder="Từ ngày"
          />
          <span className="text-muted-foreground text-xs">→</span>
          <Input
            type="date"
            value={endTime}
            onChange={(e) => updateParams({ endTime: e.target.value })}
            className="h-9 text-xs rounded-lg bg-background/50 border-border/50 w-[130px]"
            placeholder="Đến ngày"
          />
        </div>
        {(startTime || endTime) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => updateParams({ startTime: "", endTime: "" })}
          >
            Xóa lọc ngày
          </Button>
        )}
      </div>
    </div>
  );
}
