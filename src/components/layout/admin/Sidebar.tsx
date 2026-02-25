"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Menu, X, Users, Building2, Calendar, DollarSign, FolderTree } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSessionStore } from "@/stores/sesionStore";
import { authRequest } from "@/apiRequest/auth";

const navItems = [
  {
    title: "Bảng điều khiển",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Organizer",
    href: "/admin/organizers",
    icon: Building2,
  },
  {
    title: "Sự kiện",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Doanh thu",
    href: "/admin/revenue",
    icon: DollarSign,
  },
];

export default function AdminSidebar() {
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
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-full transition-all duration-300 relative group",
                    isOpen ? "px-3 py-3 gap-4" : "justify-center py-2 px-0"
                  )}
                >
                  {/* Pill nền bao quanh khi Active */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className={cn(
                        "absolute bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-full",
                        isOpen ? "inset-0" : "w-14 h-20 inset-y-[-8px] left-1/2 -translate-x-1/2"
                      )}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon Container */}
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all shadow-md",
                      isActive ? "bg-[#2a2a2a] text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Label */}
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

        {/* Add Section Button */}
        {/* <button
          className={cn(
            "mt-6 flex items-center justify-center gap-2 text-zinc-500 border border-dashed border-zinc-800 transition-all overflow-hidden shrink-0",
            isOpen ? "mx-2 h-12 rounded-[32px]" : "mx-auto w-12 h-12 rounded-full border-zinc-700"
          )}
        >
          <Plus className="w-5 h-5 shrink-0" />
          {isOpen && <span className="text-xs whitespace-nowrap">Add a section</span>}
        </button> */}

        {/* Bottom Profile */}
        <div className="mt-auto pt-6">
          {/* <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mx-2 p-5 bg-white rounded-[35px] text-black mb-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border-[3px] border-zinc-100 flex items-center justify-center text-[11px] font-black shrink-0">40%</div>
                    <div className="overflow-hidden">
                      <p className="text-[13px] font-extrabold whitespace-nowrap">Complete profile</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-zinc-100 rounded-2xl text-[12px] font-bold whitespace-nowrap hover:bg-zinc-200 transition-colors">Verify identity</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}

          <div className={cn(
            "flex items-center bg-zinc-900 rounded-[35px] border border-white/5 mx-2 transition-all overflow-hidden w-[calc(100%-16px)]",
            isOpen ? "p-3 gap-3" : "p-2 justify-center w-12 h-12 mx-auto rounded-full"
          )}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/10">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName || "Admin"}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0 animate-in fade-in duration-500">
                <p className="text-sm font-bold text-white truncate leading-none">{user?.FullName || "Admin"}</p>
                <p className="text-[10px] text-zinc-500 truncate mt-1">{user?.Email || "admin@example.com"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}