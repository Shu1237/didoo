"use client";

import { RefreshCw } from "lucide-react";

interface ResalePageHeroProps {
  totalEvents: number;
  totalCategories: number;
}

export function ResalePageHero({
  totalEvents,
  totalCategories,
}: ResalePageHeroProps) {
  return (
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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          Vé bán lại sự kiện
        </h1>
        <p className="mt-2 text-zinc-600">
          {totalEvents} sự kiện • {totalCategories} danh mục
        </p>
      </div>
    </section>
  );
}
