"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetOrganizer } from "@/hooks/useEvent";
import { useGetMe } from "@/hooks/useAuth";
import { OrganizerStatus } from "@/utils/enum";
import {
  CheckCircle2,
  Clock3,
  Mail,
  Rocket,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  [OrganizerStatus.PENDING]: {
    label: "Đang chờ xét duyệt",
    icon: Clock3,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  [OrganizerStatus.VERIFIED]: {
    label: "Nhà tổ chức đã xác minh",
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  [OrganizerStatus.BANNED]: {
    label: "Nhà tổ chức bị khóa",
    icon: XCircle,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
} as const;

export default function ProfileSidebar() {
  const { data: userData } = useGetMe();
  const user = userData?.data;

  const { data: organizerData, isLoading: isOrganizerLoading } = useGetOrganizer(
    user?.organizerId ?? "",
  );

  const initials = user?.fullName
    ? user.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("")
    : "U";

  const isUserRole = (user?.role?.name || "").toLowerCase() === "user";
  const organizerStatus = organizerData?.data?.status;
  const statusConfig = organizerStatus ? STATUS_CONFIG[organizerStatus] : null;

  return (
    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border border-slate-200 shadow-sm md:h-20 md:w-20">
          <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || "Người dùng"} />
          <AvatarFallback className="bg-slate-200 text-lg font-bold text-slate-700 md:text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-2xl font-bold leading-tight text-slate-900">
            {user?.fullName || "Người dùng"}
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500">
            <Mail className="h-3.5 w-3.5" />
            {user?.email || "Chưa đăng nhập"}
          </p>
          {user?.organizerId && (
            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                statusConfig?.className || "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {isOrganizerLoading ? (
                <span>Đang tải trạng thái...</span>
              ) : statusConfig ? (
                <>
                  <statusConfig.icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{statusConfig.label}</span>
                </>
              ) : (
                <span>Đang cập nhật trạng thái...</span>
              )}
            </div>
          )}
        </div>
      </div>

      {isUserRole && !user?.organizerId && (
        <Button
          variant="outline"
          className="h-11 rounded-xl border-orange-200 bg-orange-50 px-5 font-semibold text-orange-600 hover:bg-orange-100"
          asChild
        >
          <Link href="/user/dashboard/organizer/create">
            <Rocket className="mr-2 h-4 w-4" />
            Register as Organizer
          </Link>
        </Button>
      )}
    </div>
  );
}
