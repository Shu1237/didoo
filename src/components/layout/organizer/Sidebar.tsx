"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu, X, Calendar, Wallet, UserCircle, ShoppingBag, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSessionStore } from "@/stores/sesionStore";

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
    title: "Tạo sự kiện",
    href: "/organizer/events/create",
    icon: PlusCircle,
  },
  {
    title: "Ví & Doanh thu",
    href: "/organizer/earnings",
    icon: Wallet,
  },
  {
    title: "Đơn hàng",
    href: "/organizer/orders",
    icon: ShoppingBag,
  },
  {
    title: "Hồ sơ",
    href: "/organizer/profile",
    icon: UserCircle,
  },
];

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const user = useSessionStore((state) => state.user);

  return (
    <aside
      className={cn(
        "bg-black p-3 flex flex-col h-full rounded-[48px] relative z-20 shadow-2xl border border-white/5 transition-all duration-500 ease-in-out overflow-hidden",
        isOpen ? "w-[280px]" : "w-[90px]"
      )}
    >
      <div className="flex flex-col h-full relative z-10">
        {/* NAV BOX */}
        <div className="bg-[#1c1c1c]/60 backdrop-blur-2xl rounded-[40px] p-3 border border-white/[0.05] flex flex-col overflow-hidden">
          {/* Header */}
          <div className={cn("flex items-center mb-6 px-2 transition-all duration-500", isOpen ? "justify-between" : "justify-center")}>
            {isOpen && (
              <div className="flex items-center gap-3 animate-in fade-in duration-500">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center shrink-0 overflow-hidden border border-white/10 shadow-lg">
                  <Image
                    src="/DiDoo.png"
                    alt="DiDoo Logo"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-white tracking-tighter whitespace-nowrap">DiDoo</span>
              </div>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 shrink-0">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/organizer/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-full transition-all duration-300 relative group",
                    isOpen ? "px-3 py-3 gap-4" : "justify-center py-2 px-0"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className={cn(
                        "absolute bg-gradient-to-b from-primary/20 to-transparent border border-primary/10 rounded-full",
                        isOpen ? "inset-0" : "w-14 h-20 inset-y-[-8px] left-1/2 -translate-x-1/2"
                      )}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all shadow-md",
                      isActive ? "bg-[#2a2a2a] text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn("font-medium text-[15px] whitespace-nowrap overflow-hidden relative z-10", isActive ? "text-white" : "text-zinc-500")}
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="mt-auto pt-6">
          <div className={cn("flex items-center bg-zinc-900 rounded-[35px] border border-white/5 mx-2 transition-all overflow-hidden", isOpen ? "p-3 gap-3" : "p-2 justify-center w-12 h-12 mx-auto rounded-full")}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10 flex items-center justify-center bg-zinc-800">
              {/* <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName || "Organizer"}`} alt="avatar" className="w-full h-full object-cover" /> */}
              <span className="text-[10px] font-bold text-white">{user?.FullName?.[0] || "O"}</span>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-500">
                <p className="text-sm font-bold text-white truncate leading-none">{user?.FullName || "Organizer"}</p>
                <p className="text-[10px] text-zinc-500 truncate mt-1">{user?.Email || "organizer@didoo.com"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
