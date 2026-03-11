"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  Search,
  ArrowUpRight,
  User as UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Roles } from "@/utils/enum";
import { useAuth } from "@/hooks/useAuth";
import { useProfileWithOrganizer } from "@/hooks/useProfileWithOrganizer";

const Header = () => {
  const user = useSessionStore((state) => state.user);
  const { isVerifiedOrganizer } = useProfileWithOrganizer();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    if (!user || !user.UserId) return;
    await logout.mutateAsync({ userId: user.UserId });
  };

  const showDashboard = () => {
    if (!user) return false;
    if (user.Role === Roles.ADMIN) return true;
    return user.Role === Roles.USER && isVerifiedOrganizer;
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.Role === Roles.ADMIN) return "/admin/dashboard";
    if (isVerifiedOrganizer) return "/organizer/dashboard";
    return null;
  };

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");

  return (
    <>
      <div
        className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ${isScrolled ? "top-0" : "top-4"}`}
      >
        <header
          className="w-full max-w-6xl transition-all duration-300 bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-lg shadow-zinc-900/5 rounded-2xl py-2.5 px-6"
        >
          <div className="flex items-center justify-between h-12">
            <Link
              href="/home"
              className="flex items-center gap-2.5 group shrink-0"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-sm ring-1 ring-zinc-200/50">
                <Image
                  src="/DiDoo.png"
                  alt="DiDoo"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900">
                DiDoo
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-0.5 bg-zinc-100/80 p-1 rounded-xl border border-zinc-200/60">
              <NavItem
                href="/home"
                active={isActive("/home")}
                label="Trang chủ"
              />
              <NavItem
                href="/events"
                active={isActive("/events")}
                label="Sự kiện"
              />
              <NavItem href="/map" active={isActive("/map")} label="Bản đồ" />
              <NavItem href="/resale" active={isActive("/resale")} label="Vé bán lại" />
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-9 text-sm font-semibold shadow-md shadow-primary/20 transition-all">
                      Tài khoản
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white rounded-xl border border-zinc-200 shadow-xl p-2 mt-3"
                  >
                    <DropdownMenuLabel className="text-[10px] uppercase text-zinc-400 font-semibold px-2 py-1.5">
                      Tài khoản
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer focus:bg-zinc-50"
                      asChild
                    >
                      <Link
                        href="/user/dashboard/profile"
                        className="flex items-center gap-2.5 px-2 py-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Hồ sơ</span>
                      </Link>
                    </DropdownMenuItem>
                    {showDashboard() && getDashboardLink() && (
                      <DropdownMenuItem
                        className="rounded-lg cursor-pointer focus:bg-zinc-50"
                        asChild
                      >
                        <Link
                          href={getDashboardLink()!}
                          className="flex items-center gap-2.5 px-2 py-2"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Bảng điều khiển</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-zinc-200" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 rounded-lg cursor-pointer flex items-center gap-2.5 px-2 py-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button className="rounded-xl px-5 h-9 text-sm font-semibold flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md transition-all">
                    Đặt vé
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

const NavItem = ({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) => (
  <Link href={href}>
    <div
      className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
        active
          ? "bg-white text-primary shadow-sm border border-zinc-200/60"
          : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60"
      }`}
    >
      {label}
    </div>
  </Link>
);

export default Header;
