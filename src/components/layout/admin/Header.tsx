"use client";

import Link from "next/link";
import Image from "next/image";
import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authRequest } from "@/apiRequest/auth";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const user = useSessionStore((state) => state.user);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authRequest.logoutClient();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-md">
            <Image
              src="/DiDoo.png"
              alt="DiDoo logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">DiDoo Admin</span>
        </Link>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 py-6 rounded-full hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    <span className="font-bold text-primary text-lg">
                      {user?.name?.[0] || user?.email?.[0] || "A"}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-semibold">{user?.name || "Admin User"}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || "admin@didoo.com"}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-border/50 shadow-xl bg-background/95 backdrop-blur-xl">
              <DropdownMenuLabel className="px-2 py-1.5">Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                <Link href="/admin/settings">Cài đặt</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer focus:bg-primary/10 focus:text-primary">
                <Link href="/home">Về trang chủ</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
