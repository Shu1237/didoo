"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileHeader() {
  const user = useSessionStore((state) => state.user);

  // Get initials for avatar fallback
  const initials = user?.name
    ? user.name.substring(0, 2).toUpperCase()
    : "U";

  return (
    <div className="relative mb-12 group">
      {/* Cover Image - Decorative Gradient */}
      <div className="h-48 md:h-64 rounded-3xl bg-gradient-to-r from-primary/80 via-purple-500/80 to-accent/80 animate-gradient-x shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Avatar & Info Wrapper */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-8 -mt-20 relative z-10">
        <div className="relative">
          <Avatar className="w-32 h-32 md:w-40 md:h-40 border-[6px] border-background shadow-2xl ring-2 ring-black/5">
            <AvatarImage src="" alt={user?.name || "User"} className="object-cover" />
            <AvatarFallback className="text-4xl font-bold bg-muted text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-4 right-4 w-4 h-4 bg-green-500 border-2 border-background rounded-full shadow-lg" title="Online" />
        </div>

        <div className="flex-1 text-center md:text-left mb-4 space-y-1">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">{user?.name || "Người dùng"}</h1>
          <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 text-lg">
            {user?.email || "Chưa đăng nhập"}
          </p>
        </div>
      </div>
    </div>
  );
}
