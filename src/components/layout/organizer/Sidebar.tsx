"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  QrCode,

} from "lucide-react";

const navItems = [
  {
    title: "Bảng điều khiển",
    href: "/organizer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sự kiện",
    href: "/organizer/events",
    icon: Calendar,
  },
  {
    title: "Check-in",
    href: "/organizer/check-in",
    icon: QrCode,
  },

];

export default function OrganizerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-background/60 backdrop-blur-xl border-r border-border/50 p-6 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden",
                  isActive
                    ? "text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:shadow-sm"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-100 transition-opacity" />
                )}
                <Icon className={cn("w-5 h-5 relative z-10", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                <span className="relative z-10">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Info */}
        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
            <h4 className="font-semibold text-primary mb-1">DiDoo Organizer</h4>
            <p className="text-xs text-muted-foreground">Manage your events</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
