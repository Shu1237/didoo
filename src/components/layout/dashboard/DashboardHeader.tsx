"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ChevronDown } from "lucide-react";

const pathLabels: Record<string, string> = {
  "/admin/dashboard": "Tổng quan",
  "/admin/users": "Người dùng",
  "/admin/organizers": "Organizer",
  "/admin/events": "Sự kiện",
  "/admin/categories": "Danh mục",
  "/admin/revenue": "Doanh thu",
  "/admin/profile": "Hồ sơ",
  "/organizer/dashboard": "Tổng quan",
  "/organizer/events": "Sự kiện",
  "/organizer/orders": "Đơn hàng",
  "/organizer/earnings": "Ví & Doanh thu",
  "/organizer/profile": "Hồ sơ",
};

function getBreadcrumb(pathname: string): { href: string; label: string }[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: { href: string; label: string }[] = [];
  let acc = "";

  for (let i = 0; i < segments.length; i++) {
    acc += `/${segments[i]}`;
    const label = pathLabels[acc] || segments[i];
    items.push({ href: acc, label });
  }

  return items;
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const user = useSessionStore((state) => state.user);
  const { logout } = useAuth();

  // const breadcrumbs = getBreadcrumb(pathname);
  const isOrganizer = pathname.startsWith("/organizer");

  const handleLogout = () => {
    if (user?.UserId) {
      logout.mutate({ userId: user.UserId });
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-6 bg-white">
      <nav className="flex items-center gap-2 text-sm text-zinc-600">
        
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 rounded-xl">
            <Avatar className="h-8 w-8 border border-zinc-200">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName}`} />
              <AvatarFallback className="bg-zinc-100 text-zinc-700 text-sm">{user?.FullName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium text-zinc-700">{user?.FullName}</span>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl border-zinc-200">
          <DropdownMenuItem asChild>
            <Link href={isOrganizer ? "/organizer/profile" : "/admin/profile"} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Hồ sơ
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
