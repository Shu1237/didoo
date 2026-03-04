"use client";

import Link from "next/link";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface AdminDashboardHeaderProps {
  totalBookings: number;
  updatedAtLabel: string;
  formatNumber: (value: number) => string;
}

export default function AdminDashboardHeader({
  totalBookings,
  updatedAtLabel,
  formatNumber,
}: AdminDashboardHeaderProps) {
  return (
    <AdminPageHeader
      title="Dashboard Overview"
      description="Tong hop van hanh he thong theo thoi gian thuc tu API: nguoi dung, su kien, bookings, doanh thu."
      badge={`${formatNumber(totalBookings)} bookings`}
    >
      <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
        Cap nhat luc {updatedAtLabel}
      </p>

      <Button asChild variant="outline" className="h-9 rounded-xl border-zinc-200 px-3 text-xs">
        <Link href="/admin/organizers">Duyet organizer</Link>
      </Button>

      <Button asChild className="h-9 rounded-xl px-3 text-xs">
        <Link href="/admin/revenue">
          Revenue report
          <ArrowUpRight className="ml-1.5 h-4 w-4" />
        </Link>
      </Button>
    </AdminPageHeader>
  );
}
