// src/components/Header.tsx

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
    return (
        // Header Cố định
        <header className="fixed top-0 left-0 right-0 p-3 md:p-4 z-50">
            <div className="mx-auto max-w-6xl">

                {/* Thanh Menu Chính với Gradient */}
                <div className="bg-gradient-to-r from-primary via-accent to-primary text-white flex items-center justify-between px-6 py-2 rounded-4xl shadow-lg" >

                    {/* Phần bên trái: Logo và Tên ứng dụng */}
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

                    {/* Phần giữa: Menu điều hướng */}
                    <nav className="flex items-center space-x-6 md:flex">

                        {/* Thay thế link "Khám phá sự kiện" bằng DropdownMenu */}
                        <DropdownMenu>
                            {/* Nút kích hoạt Dropdown */}
                            <DropdownMenuTrigger asChild>
                                {/* Thêm lớp Tailwind để đảm bảo style đồng bộ với các link khác */}
                                <div
                                    className="text-sm font-medium cursor-pointer hover:opacity-80 flex items-center group text-foreground"
                                >
                                    Khám phá sự kiện
                                    <ChevronDown
                                        className="w-3 h-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180"
                                    />
                                </div>
                            </DropdownMenuTrigger>

                            {/* Nội dung Dropdown Menu */}
                            {/* Bạn nên đặt DropdownMenuContent bên ngoài Header cố định 
                                hoặc đảm bảo các style của Shadcn/ui được áp dụng đúng */}
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

                        {/* Mục Tạo sự kiện (giữ nguyên link) */}
                        <Link
                            href="/create-event"
                            className="text-sm font-medium hover:opacity-80 text-foreground"
                        >
                            Tạo sự kiện
                        </Link>
                    </nav>

                    {/* Phần bên phải: Nút hành động */}
                    <div className="flex items-center gap-2">
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
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;