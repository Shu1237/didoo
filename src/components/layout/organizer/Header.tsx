"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, Mail, Command, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function OrganizerHeader() {
  const user = useSessionStore((state) => state.user);
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (!user?.UserId) return;
    await logout.mutateAsync({ userId: user.UserId });
  };

  return (
    <header className="px-8 py-4 flex items-center justify-between bg-white border-b border-zinc-100">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm sự kiện, doanh thu..."
            className="pl-12 pr-12 h-11 rounded-2xl bg-zinc-100 border-transparent hover:bg-zinc-100/80 focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 text-zinc-700 font-semibold"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-30 select-none">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-black tracking-tighter uppercase">F</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200/50 relative transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-white shadow-sm" />
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="w-11 h-11 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200/50 transition-all">
          <Mail className="w-5 h-5" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-zinc-800 p-0 overflow-hidden shadow-md border border-zinc-200">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName || "Organizer"}`} />
                <AvatarFallback className="bg-zinc-900 text-white font-black italic">
                  {user?.FullName?.[0] || "O"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-zinc-100 shadow-xl bg-white p-2">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-sm font-bold text-zinc-900">{user?.FullName || "Organizer"}</p>
              <p className="text-xs text-zinc-500 font-medium">{user?.Email || "organizer@example.com"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100 my-1" />
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-zinc-50">
              <Link href="/organizer/profile" className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-500" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-zinc-50">
              <Link href="/home" className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-500" />
                <span>Về trang chủ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100 my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
