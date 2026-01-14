"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSessionStore } from "@/stores/sesionStore";
import { authRequest } from "@/apiRequest/auth";
import { Button } from "@/components/ui/button";
import { isOrganizerOrAdmin } from "@/utils/permissions";
import {
    Map as MapIcon,
    ChevronDown,
    Music,
    Trophy,
    Cpu,
    Briefcase,
    GraduationCap,
    Hammer,
    MapPin,
    Wifi,
    Gift,
    List,
    Ticket,
    User,
    LogOut,
    LayoutDashboard,
    HelpCircle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./buttonMode";

const Header = () => {
    const user = useSessionStore((state) => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [hoveredNav, setHoveredNav] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
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

    // Interaction: Active link check
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

    return (
        <>
            {/* Blur Overlay when Mega Menu is open */}
            <div
                className={`fixed inset-0 bg-background/20 backdrop-blur-sm z-40 transition-opacity duration-500 ${hoveredNav === 'categories' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
            />

            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${scrolled || hoveredNav ? 'bg-[#0F0F1A]/90 backdrop-blur-md border-white/10 shadow-lg py-3' : 'bg-[#0F0F1A] py-4'
                    }`}
                onMouseLeave={() => setHoveredNav(null)}
            >
                <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">

                    {/* Left: Logo & Navigation */}
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link href="/home" className="flex items-center gap-3 group">
                            <div className="relative overflow-hidden rounded-lg">
                                <Image
                                    src="/DiDoo.png"
                                    alt="DiDoo logo"
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 object-cover transition-transform duration-300 group-hover:scale-110"
                                    priority
                                />
                            </div>
                            <span className="font-sans font-bold text-2xl tracking-tighter text-white">
                                DiDoo
                            </span>
                        </Link>

                        {/* Primary Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {/* Home */}
                            <NavItem href="/home" active={isActive('/home')} label="Home" />

                            {/* Events Dropdown */}
                            <div
                                className="relative group h-full"
                                onMouseEnter={() => setHoveredNav('events')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${isActive('/events') ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}>
                                    Events
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                                    {/* Underline Animation */}
                                    <span className={`absolute bottom-0 left-4 h-[2px] bg-[#6C5CE7] transition-all duration-300 ease-out ${isActive('/events') ? 'w-[calc(100%-2rem)]' : 'w-0 group-hover:w-[calc(100%-2rem)]'
                                        }`} />
                                </button>

                                {/* Simple Dropdown Content */}
                                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                    <div className="p-2 space-y-1">
                                        <DropdownItem href="/events" icon={<List className="w-4 h-4" />} title="All Events" />
                                        <DropdownItem href="/events?filter=near-me" icon={<MapPin className="w-4 h-4 text-[#00CEC9]" />} title="Near Me" />
                                        <DropdownItem href="/events?filter=online" icon={<Wifi className="w-4 h-4 text-[#6C5CE7]" />} title="Online Events" />
                                        <DropdownItem href="/events?filter=free" icon={<Gift className="w-4 h-4 text-[#FD79A8]" />} title="Free Events" />
                                    </div>
                                </div>
                            </div>

                            {/* Categories Mega Menu */}
                            <div
                                className="relative group h-full"
                                onMouseEnter={() => setHoveredNav('categories')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${isActive('/categories') ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}>
                                    Categories
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                                    <span className={`absolute bottom-0 left-4 h-[2px] bg-[#6C5CE7] transition-all duration-300 ease-out ${isActive('/categories') ? 'w-[calc(100%-2rem)]' : 'w-0 group-hover:w-[calc(100%-2rem)]'
                                        }`} />
                                </button>

                                {/* Mega Menu Content */}
                                <div className="absolute top-full left-0 mt-2 w-[800px] bg-[#1A1A2E] border border-white/10 rounded-xl shadow-2xl overflow-hidden opacity-0 invisible translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 p-6 grid grid-cols-3 gap-6 z-50">

                                    {/* Column 1: Entertainment */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Entertainment</h3>
                                        <div className="space-y-1">
                                            <MegaMenuItem href="/events/music" icon={<Music className="w-5 h-5 text-[#FD79A8]" />} title="Music" desc="Concerts, Festivals & Live" />
                                            <MegaMenuItem href="/events/sport" icon={<Trophy className="w-5 h-5 text-[#FDCB6E]" />} title="Sports" desc="Matches, Marathons & eSports" />
                                        </div>
                                    </div>

                                    {/* Column 2: Development */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Development</h3>
                                        <div className="space-y-1">
                                            <MegaMenuItem href="/events/tech" icon={<Cpu className="w-5 h-5 text-[#00CEC9]" />} title="Technology" desc="Coding, AI & Robotics" />
                                            <MegaMenuItem href="/events/workshop" icon={<Hammer className="w-5 h-5 text-[#6C5CE7]" />} title="Workshops" desc="Hands-on Learning" />
                                            <MegaMenuItem href="/events/business" icon={<Briefcase className="w-5 h-5 text-[#0984E3]" />} title="Business" desc="Networking & Startups" />
                                        </div>
                                    </div>

                                    {/* Column 3: Knowledge */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-2">Knowledge</h3>
                                        <div className="space-y-1">
                                            <MegaMenuItem href="/events/education" icon={<GraduationCap className="w-5 h-5 text-white" />} title="Education" desc="Seminars & Universities" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <NavItem href="/map" active={isActive('/map')} label="Map" icon={<MapIcon className="w-4 h-4 mr-1.5" />} />

                            {/* About Dropdown */}
                            <div
                                className="relative group h-full"
                                onMouseEnter={() => setHoveredNav('about')}
                                onMouseLeave={() => setHoveredNav(null)}
                            >
                                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    About
                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                                    <span className="absolute bottom-0 left-4 h-[2px] bg-[#6C5CE7] transition-all duration-300 ease-out w-0 group-hover:w-[calc(100%-2rem)]" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-xl overflow-hidden opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                                    <div className="p-2 space-y-1">
                                        <DropdownItem href="/help/tickets" icon={<Ticket className="w-4 h-4" />} title="How to buy tickets" />
                                        <DropdownItem href="/help/faqs" icon={<HelpCircle className="w-4 h-4" />} title="FAQs" />
                                    </div>
                                </div>
                            </div>

                        </nav>
                    </div>

                    {/* Right: Auth / Profile */}
                    <div className="flex items-center gap-4">
                        {/* <ModeToggle /> */}
                        {user && isOrganizerOrAdmin(user.role) && (
                            <Link href="/organizer/events/create">
                                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 hidden lg:flex">
                                    Create Event
                                </Button>
                            </Link>
                        )}

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="bg-[#6C5CE7] hover:bg-[#5a4ad1] text-white rounded-full px-6 font-medium shadow-[0_0_15px_rgba(108,92,231,0.5)] transition-shadow duration-300">
                                        My Account
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-[#1A1A2E] border-white/10 text-gray-200">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer" asChild>
                                        <Link href="/user/tickets">
                                            <Ticket className="w-4 h-4 mr-2" /> My Tickets
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer" asChild>
                                        <Link href="/user/profile">
                                            <User className="w-4 h-4 mr-2" /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    {getDashboardLink() && (
                                        <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer" asChild>
                                            <Link href={getDashboardLink()!}>
                                                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                                        <LogOut className="w-4 h-4 mr-2" /> Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                    Log In
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-[#6C5CE7] hover:bg-[#5a4ad1] text-white rounded-full px-5 shadow-[0_4px_14px_0_rgba(108,92,231,0.39)] hover:shadow-[0_6px_20px_rgba(108,92,231,0.23)] hover:-translate-y-[1px] transition-all">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

// Helper Components
const NavItem = ({ href, active, label, icon }: { href: string; active: boolean; label: string; icon?: React.ReactNode }) => (
    <Link
        href={href}
        className={`relative px-4 py-2 text-sm font-medium transition-colors flex items-center group ${active ? 'text-white' : 'text-gray-300 hover:text-white'
            }`}
    >
        {icon}
        {label}
        <span className={`absolute bottom-0 left-4 h-[2px] bg-[#6C5CE7] transition-all duration-300 ease-out ${active ? 'w-[calc(100%-2rem)]' : 'w-0 group-hover:w-[calc(100%-2rem)]'
            }`} />
    </Link>
);

const DropdownItem = ({ href, icon, title }: { href: string; icon: React.ReactNode; title: string }) => (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group">
        <div className="text-gray-400 group-hover:text-white transition-colors">{icon}</div>
        <span className="text-sm text-gray-300 group-hover:text-white font-medium">{title}</span>
    </Link>
);

const MegaMenuItem = ({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) => (
    <Link href={href} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/10 transition-all group">
        <div className="mt-1 p-2 rounded-md bg-white/5 group-hover:bg-white/10 transition-colors">
            {icon}
        </div>
        <div>
            <div className="font-semibold text-gray-200 group-hover:text-white transition-colors">{title}</div>
            <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-0.5">{desc}</div>
        </div>
    </Link>
);

export default Header;