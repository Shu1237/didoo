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
export default function AdminHeader() {
  const user = useSessionStore((state) => state.user);
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (!user?.UserId) return;
    await logout.mutateAsync({ userId: user.UserId });
   
  };

  return (
    <header className="px-8 py-5 flex items-center justify-between bg-transparent">
      {/* Left: Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" />
          <Input
            placeholder="Search anything..."
            className="pl-12 pr-12 h-12 rounded-2xl bg-zinc-200/50 border-transparent hover:bg-zinc-200/80 focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all placeholder:text-zinc-400 text-zinc-700 font-medium"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
            <Command className="w-3 h-3" />
            <span className="text-xs font-bold">F</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-zinc-200/50 hover:bg-zinc-200 text-zinc-600 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white/50" />
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-zinc-200/50 hover:bg-zinc-200 text-zinc-600">
          <Mail className="w-5 h-5" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 p-0 overflow-hidden shadow-lg shadow-zinc-900/20">
              <Avatar className="h-full w-full">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.FullName || "Admin"}`} />
                <AvatarFallback className="bg-zinc-900 text-white font-bold">
                  {user?.FullName?.[0] || "A"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-zinc-100 shadow-xl bg-white p-2 text-zinc-600">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-sm font-bold text-zinc-900">{user?.FullName || "Admin"}</p>
              <p className="text-xs text-zinc-500 font-medium">{user?.Email || "admin@example.com"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100 my-1" />
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-zinc-50">
              <Link href="/admin/profile" className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-500" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-zinc-50">
              <Link href="/admin/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-500" />
                <span>Settings</span>
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
