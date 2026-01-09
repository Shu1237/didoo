"use client";

import { useSessionStore } from "@/stores/sesionStore";

export default function ProfileHeader() {
  const user = useSessionStore((state) => state.user);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Hồ sơ của tôi</h1>
      <p className="text-muted-foreground mt-2">
        {user?.email || "Chưa đăng nhập"}
      </p>
    </div>
  );
}
