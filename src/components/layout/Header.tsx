"use client";

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSessionStore } from "@/stores/sesionStore";
import { useRouter } from "next/navigation";
import { authRequest } from "@/apiRequest/auth";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isOrganizerOrAdmin } from "@/utils/permissions";

const Header = () => {
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

    const getDashboardLink = () => {
        if (!user) return null;
        if (user.role === "admin") return "/admin/dashboard";
        if (user.role === "organizer") return "/organizer/dashboard";
        return "/user/profile";
    };

    return (
        <header className="fixed top-0 left-0 right-0 p-3 md:p-4 z-50">
            <div className="mx-auto max-w-6xl">
                <div className="bg-gradient-to-r from-primary via-accent to-primary text-white flex items-center justify-between px-6 py-2 rounded-4xl shadow-lg">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center gap-2">
                            <Link href="/home" className="flex items-center gap-2">
                                <Image
                                    src="/DiDoo.png"
                                    alt="DiDoo logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-md"
                                    priority
                                />
                                <span className="font-bold text-xl text-foreground">DiDoo</span>
                            </Link>
                        </div>
                    </div>

                    <nav className="flex items-center space-x-6 md:flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="text-sm font-medium cursor-pointer hover:opacity-80 flex items-center group text-foreground">
                                    Khám phá sự kiện
                                    <ChevronDown className="w-3 h-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-3 bg-white text-gray-800 shadow-xl rounded-lg">
                                <DropdownMenuLabel>Danh mục Sự kiện</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/events/music">Âm nhạc & Nghệ thuật</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/events/tech">Công nghệ & Hội thảo</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/events/sport">Thể thao & Giải trí</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/events">Xem tất cả</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {isOrganizerOrAdmin(user?.role) && (
                            <Link
                                href="/organizer/events/create"
                                className="text-sm font-medium hover:opacity-80 text-foreground"
                            >
                                Tạo sự kiện
                            </Link>
                        )}

                        <Link
                            href="/map"
                            className="text-sm font-medium hover:opacity-80 text-foreground"
                        >
                            Bản đồ
                        </Link>
                    </nav>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="text-foreground">
                                        {user.name || user.email}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white text-gray-800">
                                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/user/tickets">Vé của tôi</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/user/profile">Hồ sơ</Link>
                                    </DropdownMenuItem>
                                    {getDashboardLink() && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={getDashboardLink()!}>Bảng điều khiển</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold tracking-wider hover:opacity-80 transition-opacity whitespace-nowrap text-foreground"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="text-sm font-semibold tracking-wider hover:opacity-80 transition-opacity whitespace-nowrap text-foreground"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;