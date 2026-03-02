"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionStore } from "@/stores/sesionStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Search, UserCircle2 } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "Quản lý người dùng",
  "/admin/organizers": "Quản lý organizer",
  "/admin/events": "Quản lý sự kiện",
  "/admin/categories": "Quản lý danh mục",
  "/admin/revenue": "Doanh thu hệ thống",
  "/admin/profile": "Hồ sơ admin",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const user = useSessionStore((state) => state.user);
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (!user?.UserId) return;
    await logout.mutateAsync({ userId: user.UserId });
  };

  const pageTitle = pageTitles[pathname] || "Admin";

  return (
    <header className="border-b border-zinc-200 bg-white px-4 py-3 lg:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">Admin Center</p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-zinc-900">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden w-64 lg:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input placeholder="Tìm nhanh trong trang admin" className="h-9 rounded-xl border-zinc-200 pl-9" />
          </div>

          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-zinc-200">
            <Bell className="h-4 w-4 text-zinc-600" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border border-zinc-200">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName || "Admin"}`} />
                  <AvatarFallback className="bg-zinc-100 text-zinc-700">
                    {user?.FullName?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl border-zinc-200">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold text-zinc-900">{user?.FullName || "Admin"}</p>
                <p className="text-xs text-zinc-500">{user?.Email || "admin@didoo.vn"}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile" className="flex items-center gap-2">
                  <UserCircle2 className="h-4 w-4" />
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-rose-600 focus:text-rose-700">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
