"use client"
import LayoutAuth from "@/components/layout/auth/layout";
import { useSessionStore } from "@/stores/sesionStore";
import { getRedirectPathForRole } from "@/utils/enum";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    if (user?.RoleId) {
      const path = getRedirectPathForRole(user.RoleId);
      router.replace(path);
    }
  }, [user, router]);
  return (
    <LayoutAuth>
      {children}
    </LayoutAuth>
  );
}
