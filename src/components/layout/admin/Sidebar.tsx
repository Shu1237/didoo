"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSessionStore } from "@/stores/sesionStore";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  FolderTree,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Người dùng", href: "/admin/users", icon: Users },
  { title: "Organizer", href: "/admin/organizers", icon: Building2 },
  { title: "Sự kiện", href: "/admin/events", icon: Calendar },
  { title: "Danh mục", href: "/admin/categories", icon: FolderTree },
  { title: "Doanh thu", href: "/admin/revenue", icon: DollarSign },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const user = useSessionStore((state) => state.user);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-200",
        collapsed ? "w-[92px]" : "w-[270px]"
      )}
    >
      <div className={cn("mb-4 flex items-center", collapsed ? "justify-center" : "justify-between")}> 
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-zinc-200">
              <Image src="/DiDoo.png" alt="DiDoo" width={36} height={36} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Admin</p>
              <p className="text-sm font-semibold text-zinc-900">DiDoo</p>
            </div>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
                collapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("mt-auto rounded-2xl border border-zinc-200 bg-zinc-50", collapsed ? "p-2" : "p-3")}>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-2")}>
          <Avatar className="h-9 w-9 border border-zinc-200">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName || "Admin"}`} />
            <AvatarFallback className="bg-zinc-100 text-zinc-700">
              {user?.FullName?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">{user?.FullName || "Admin"}</p>
              <p className="truncate text-xs text-zinc-500">{user?.Email || "admin@didoo.vn"}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
