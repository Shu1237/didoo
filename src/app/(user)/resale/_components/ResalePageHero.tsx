"use client";

import { RefreshCw, LayoutGrid } from "lucide-react";

interface ResalePageHeroProps {
  totalEvents: number;
  totalCategories: number;
}

export function ResalePageHero({
  totalEvents,
  totalCategories,
}: ResalePageHeroProps) {
  return <></>
  // <section className="relative overflow-hidden px-4 pt-16 pb-12">
  //   {/* Background decorations */}
  //   <div className="pointer-events-none absolute inset-0 -z-10">
  //     <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px]" />
  //     <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
  //   </div>

  //   <div className="mx-auto max-w-6xl">
  //     <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs font-bold text-amber-600 mb-6 backdrop-blur-sm">
  //       <RefreshCw className="h-3.5 w-3.5" />
  //       VÉ BÁN LẠI
  //     </div>

  //     <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 mb-4">
  //       Vé bán lại sự kiện
  //     </h1>

  //     <div className="flex items-center gap-4 text-zinc-500 font-medium">
  //       <div className="flex items-center gap-1.5">
  //         <LayoutGrid className="h-4 w-4 text-amber-500" />
  //         <span>{totalEvents} sự kiện</span>
  //       </div>
  //       <div className="w-1.5 h-1.5 rounded-full bg-zinc-200" />
  //       <div className="flex items-center gap-1.5">
  //         <RefreshCw className="h-4 w-4 text-amber-500" />
  //         <span>{totalCategories} danh mục</span>
  //       </div>
  //     </div>

  //     <div className="mt-8 h-1 w-20 bg-gradient-to-r from-amber-500 to-amber-200 rounded-full" />
  //   </div>
  // </section>

}
