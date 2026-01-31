"use client";

import { usePathname } from "next/navigation";

export const PageContainer = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    // Check if we are on a full-screen page (Home, Map, or Events)
    const isFullScreenPage = pathname === "/home" || pathname === "/" || pathname?.startsWith("/map") || pathname?.startsWith("/events");

    return (
        <main className={`flex-1 transition-all duration-300 ${isFullScreenPage ? "" : "pt-20"}`}>
            {children}
        </main>
    );
};
