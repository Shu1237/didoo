"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/stores/sesionStore";
import { authRequest } from "@/apiRequest/auth";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    MapPin,
    Wifi,
    Gift,
    List,
    Ticket,
    LogOut,
    LayoutDashboard,
    Palette,
    Brush,
    Rocket,
    Zap,
    Briefcase,
    Cpu,
    Search,
    ArrowUpRight
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
    const user = useSessionStore((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

    return (
        <>
            {/* Overlay làm mờ nền khi hover Mega Menu */}
            <div
                className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300 ${hoveredNav === 'categories' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
            />

            {/* Container Header dạng viên thuốc */}
            <div className={`fixed left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ${isScrolled ? 'top-0' : 'top-4'}`}>
                <header
                    className="w-full max-w-6xl transition-all duration-300 bg-white/70 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full py-2 px-6"
                    onMouseLeave={() => setHoveredNav(null)}
                >
                    <div className="flex items-center justify-between h-12">

                        {/* LEFT: Logo */}
                        <Link href="/home" className="flex items-center gap-2 group shrink-0">
                            <div className="relative h-8 w-8 overflow-hidden rounded-full shadow-sm">
                                <Image
                                    src="/DiDoo.png"
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <span className="font-bold text-xl tracking-tighter text-slate-900">
                                DiDoo
                            </span>
                        </Link>

                        {/* CENTER: Navigation */}
                        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
                            <NavItem href="/home" active={isActive('/home')} label="Home" />

                            {/* Events Dropdown */}
                            <div className="relative group" onMouseEnter={() => setHoveredNav('events')}>
                                <button className="flex items-center gap-1 px-4 py-1.5 text-[14px] font-medium transition-colors rounded-full text-slate-600 hover:text-slate-900 hover:bg-white shadow-sm hover:shadow-none">
                                    Events <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                                </button>
                                <div className="absolute top-full left-0 pt-4 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="bg-white/90 backdrop-blur-lg border border-slate-200/50 rounded-2xl shadow-xl p-2 space-y-1">
                                        <DropdownItem href="/events" icon={<List className="w-4 h-4" />} title="All Events" />
                                        <DropdownItem href="/events?filter=near-me" icon={<MapPin className="w-4 h-4 text-cyan-500" />} title="Near Me" />
                                        <DropdownItem href="/events?filter=online" icon={<Wifi className="w-4 h-4 text-indigo-500" />} title="Online" />
                                        <DropdownItem href="/events?filter=free" icon={<Gift className="w-4 h-4 text-pink-500" />} title="Free" />
                                    </div>
                                </div>
                            </div>

                            {/* Categories Mega Menu */}
                            <div className="relative group" onMouseEnter={() => setHoveredNav('categories')}>
                                <button className="flex items-center gap-1 px-4 py-1.5 text-[14px] font-medium transition-colors rounded-full text-slate-600 hover:text-slate-900 hover:bg-white">
                                    Categories <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                                </button>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-3xl shadow-2xl p-6 grid grid-cols-3 gap-6">
                                        <CategorySection title="Creative" items={[
                                            { href: "/events/design", icon: <Palette className="w-5 h-5 text-pink-500" />, title: "UI/UX Design", desc: "Interfaces" },
                                            { href: "/events/art", icon: <Brush className="w-5 h-5 text-cyan-500" />, title: "Art Direction", desc: "Aesthetics" }
                                        ]} />
                                        <CategorySection title="Tech" items={[
                                            { href: "/events/tech", icon: <Cpu className="w-5 h-5 text-blue-500" />, title: "Technology", desc: "Software" },
                                            { href: "/events/innovation", icon: <Zap className="w-5 h-5 text-orange-500" />, title: "Innovation", desc: "Trends" }
                                        ]} />
                                        <CategorySection title="Business" items={[
                                            { href: "/events/leadership", icon: <Briefcase className="w-5 h-5 text-slate-700" />, title: "Leadership", desc: "Skills" },
                                            { href: "/events/startup", icon: <Rocket className="w-5 h-5 text-emerald-500" />, title: "Startups", desc: "Growth" }
                                        ]} />
                                    </div>
                                </div>
                            </div>

                            <NavItem href="/map" active={isActive('/map')} label="Map" />
                        </nav>

                        {/* RIGHT: Auth / Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-full transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-100/50">
                                <Search className="w-5 h-5" />
                            </button>

                            {user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 h-9 text-sm font-medium shadow-lg shadow-orange-500/20 transition-all">
                                            Account
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-white/90 backdrop-blur-md rounded-xl border-slate-100 shadow-xl p-2 mt-4">
                                        <DropdownMenuLabel className="text-[10px] uppercase text-slate-400 font-bold px-2 py-1.5">Settings</DropdownMenuLabel>
                                        <DropdownMenuItem className="rounded-lg cursor-pointer" asChild>
                                            <Link href="/user/tickets" className="flex items-center gap-2.5 px-2 py-2"><Ticket className="w-4 h-4" /> <span>My Tickets</span></Link>
                                        </DropdownMenuItem>
                                        {getDashboardLink() && (
                                            <DropdownMenuItem className="rounded-lg cursor-pointer" asChild>
                                                <Link href={getDashboardLink()!} className="flex items-center gap-2.5 px-2 py-2"><LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span></Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout} className="text-red-500 rounded-lg cursor-pointer flex items-center gap-2.5 px-2 py-2">
                                            <LogOut className="w-4 h-4" /> <span className="font-medium">Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button className="rounded-full px-5 h-9 text-sm font-semibold flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
                                        Ticket <ArrowUpRight className="w-4 h-4" />
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

// --- Sub-components tối ưu cho giao diện mới ---

const NavItem = ({ href, active, label }: { href: string; active: boolean; label: string }) => (
    <Link href={href}>
        <div className={`px-4 py-1.5 text-[14px] font-medium transition-all rounded-full ${active
            ? "bg-white text-orange-600 shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}>
            {label}
        </div>
    </Link>
);

const DropdownItem = ({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) => (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group">
        <div className="text-slate-400 group-hover:text-slate-900">{icon}</div>
        <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium">{title}</span>
    </Link>
);

const CategorySection = ({ title, items }: { title: string; items: any[] }) => (
    <div className="space-y-4">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3">{title}</h3>
        <div className="space-y-1">
            {items.map((item, idx) => (
                <MegaMenuItem key={idx} {...item} />
            ))}
        </div>
    </div>
);

const MegaMenuItem = ({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) => (
    <Link href={href} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group">
        <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white group-hover:shadow-sm text-slate-600 group-hover:text-slate-900 transition-all">
            {icon}
        </div>
        <div>
            <div className="font-bold text-slate-700 group-hover:text-slate-900 text-[13px]">{title}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{desc}</div>
        </div>
    </Link>
);

export default Header;