"use client"
import LayoutAuth from "@/components/layout/auth/layout";
import { useSessionStore } from "@/stores/sesionStore";
import { Roles } from "@/utils/enum";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);

  const roleRedirects: Record<Roles, string> = {
    [Roles.ADMIN]: "/admin",
    [Roles.USER]: "/home",
    [Roles.ORGANIZER]: "/organizer",


  };
  useEffect(() => {
    if (user) {
      router.push(roleRedirects[user.role]);
    }
  }, [user]);
  return (
    <LayoutAuth>
      {children}
    </LayoutAuth>
  );
}
