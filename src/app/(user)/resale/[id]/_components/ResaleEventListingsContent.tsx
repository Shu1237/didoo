"use client";

import { useMemo, useState, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  Ticket, 
  Calendar, 
  MapPin, 
  Search, 
  ChevronRight,
  ShieldCheck,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Event } from "@/types/event";
import type { TicketListing } from "@/types/ticket";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2000&auto=format&fit=crop";

interface ResaleEventListingsContentProps {
  eventId: string;
  event: Event;
  listings: TicketListing[];
}

type ListingWithQuantity = TicketListing & {
  quantity?: number;
  totalQuantity?: number;
};

export function ResaleEventListingsContent({
  eventId,
  event,
  listings,
}: ResaleEventListingsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState(searchParams.get("search") ?? "");
  const [localQuantity, setLocalQuantity] = useState(searchParams.get("quantity") ?? "all");
  const [localMinPrice, setLocalMinPrice] = useState(searchParams.get("fromPrice") ?? "");
  const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get("toPrice") ?? "");

  const pageNumber = Math.max(1, Number(searchParams.get("pageNumber") ?? 1));
  const pageSize = 9; // Grid of 3x3

  const filteredListings = useMemo(() => {
    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const quantity = searchParams.get("quantity");
    const minPrice = searchParams.get("fromPrice");
    const maxPrice = searchParams.get("toPrice");

    return listings.filter((l) => {
      const matchSearch = !search || 
        l.id.toLowerCase().includes(search) || 
        (l.description?.toLowerCase().includes(search) ?? false);
      
      const lq = l as ListingWithQuantity;
      const lQty = Number(lq.quantity ?? lq.totalQuantity ?? 0);
      const matchQuantity = !quantity || quantity === "all" || lQty === Number(quantity);
      
      const price = Number(l.askingPrice ?? 0);
      const matchMin = !minPrice || price >= Number(minPrice);
      const matchMax = !maxPrice || price <= Number(maxPrice);

      return matchSearch && matchQuantity && matchMin && matchMax;
    });
  }, [listings, searchParams]);

  const totalItems = filteredListings.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagedListings = filteredListings.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

  const minPrice = useMemo(() => {
    if (listings.length === 0) return 0;
    return Math.min(...listings.map(l => Number(l.askingPrice ?? 0)));
  }, [listings]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localSearch) params.set("search", localSearch); else params.delete("search");
    if (localQuantity && localQuantity !== "all") params.set("quantity", localQuantity); else params.delete("quantity");
    if (localMinPrice) params.set("fromPrice", localMinPrice); else params.delete("fromPrice");
    if (localMaxPrice) params.set("toPrice", localMaxPrice); else params.delete("toPrice");
    params.set("pageNumber", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20 pt-20">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/resale" className="hover:text-primary transition-colors">Vé bán lại</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-900">{event.name} - Vé bán lại</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="relative h-[320px] w-full overflow-hidden rounded-[32px] shadow-2xl">
          <Image
            src={event.bannerUrl || FALLBACK_IMAGE}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
            <div className="space-y-4">
              <Badge className="bg-[#FF8A3D] hover:bg-[#FF8A3D] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-none">
                TRUNG TÂM BÁN LẠI CHÍNH THỨC
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-zinc-200">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#FF8A3D]" />
                  <span className="font-medium">
                    {event.startTime ? new Date(event.startTime).toLocaleDateString("vi-VN", {
                      month: "short",
                      day: "numeric",
                    }) : "Sẽ cập nhật"}
                    {event.endTime && ` - ${new Date(event.endTime).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      year: "numeric"
                    })}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#FF8A3D]" />
                  <span className="font-medium">
                    {event.locations?.[0]?.name || "Địa điểm sẽ cập nhật"}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="backdrop-blur-md bg-white/10 border border-white/20 p-4 rounded-2xl shadow-xl min-w-[200px]">
                <p className="text-zinc-300 text-xs font-medium mb-1">Giá từ</p>
                <p className="text-white text-3xl font-bold">
                  {minPrice.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="mx-auto max-w-7xl px-4 mb-10">
        <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col lg:flex-row items-end gap-4">
          <div className="flex flex-col sm:flex-row flex-1 w-full gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-foreground px-1">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Khu vực, hàng hoặc ghế..."
                  className="pl-10 h-10 w-full"
                />
              </div>
            </div>

            <div className="w-full lg:w-48 space-y-2">
              <label className="text-sm font-medium text-foreground px-1">SỐ LƯỢNG</label>
              <Select value={localQuantity} onValueChange={setLocalQuantity}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="1 vé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Bất kỳ</SelectItem>
                  <SelectItem value="1">1 vé</SelectItem>
                  <SelectItem value="2">2 vé</SelectItem>
                  <SelectItem value="4">4 vé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-40 space-y-2">
              <label className="text-sm font-medium text-foreground px-1">GIÁ THẤP NHẤT</label>
              <div className="relative">
                <Input 
                  type="number"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  placeholder="0"
                  className="h-10 w-full pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">đ</span>
              </div>
            </div>

            <div className="w-full lg:w-40 space-y-2">
              <label className="text-sm font-medium text-foreground px-1">GIÁ CAO NHẤT</label>
              <div className="relative">
                <Input 
                  type="number"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  placeholder="20.000"
                  className="h-10 w-full pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400">đ</span>
              </div>
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

      {/* Listings Section */}
      <section className="mx-auto max-w-7xl px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-900">Vé đang bán</h2>
            <Badge variant="secondary" className="bg-[#FFF4ED] text-[#FF8A3D] border-none font-medium">
              {totalItems} kết quả
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
            <span>Sắp xếp:</span>
            <button className="text-zinc-900 flex items-center gap-1 hover:text-primary transition-colors">
              Giá thấp nhất
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        {pagedListings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
            <Info className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">Không có vé phù hợp bộ lọc đã chọn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedListings.map((listing) => {
              const lq = listing as ListingWithQuantity;
              const qty = Number(listing.ticket?.length ?? lq.quantity ?? lq.totalQuantity ?? 1);
              const isVerified = true; // Mock constant based on design

              return (
                <div key={listing.id} className="bg-white rounded-3xl border border-zinc-100 p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-[10px] font-bold text-zinc-400 tracking-wider">
                      MÃ TIN: #{listing.id.slice(-8).toUpperCase()}
                    </div>
                    {isVerified && (
                      <Badge className="bg-[#E7F9EF] text-[#2ECC71] hover:bg-[#E7F9EF] border-none text-[10px] font-bold rounded-full px-2 py-0.5 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        ĐÃ XÁC MINH
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-4 line-clamp-1">
                    {listing.description || "Khu A, hàng 12"}
                  </h3>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center gap-3 text-zinc-600">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                        <Ticket className="h-4 w-4 text-[#FF8A3D]" />
                      </div>
                      <span className="text-sm font-medium">Ghế 104, 105 (liền kề)</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-600">
                      <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                        <Info className="h-4 w-4 text-[#FF8A3D]" />
                      </div>
                      <span className="text-sm font-medium">Chuyển vé điện tử qua email</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-6 border-t border-zinc-50">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Tổng cho {qty} vé</p>
                      <p className="text-2xl font-black text-zinc-900 leading-none">
                        {Number(listing.askingPrice ?? 0).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <Button asChild className="bg-[#FF8A3D] hover:bg-[#E67A2E] text-white font-bold rounded-xl px-6">
                      <Link href={`/resale/${eventId}/trade-booking/${listing.id}`}>
                        Mua ngay
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Numeric Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  // Basic pagination logic to show limited numbers
                  if (totalPages > 7) {
                    if (p > 3 && p < totalPages - 1 && Math.abs(p - pageNumber) > 1) {
                      if (p === 4 || p === totalPages - 2) return <span key={p} className="text-zinc-400">...</span>;
                      return null;
                    }
                  }

                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                        pageNumber === p 
                          ? "bg-[#FF8A3D] text-white shadow-lg shadow-primary/20" 
                          : "text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
