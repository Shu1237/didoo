"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
  Settings2,
  Shield,
  Ticket,
  UserCircle2,
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "general";

  const handleTabChange = (newTab: string) => {
    router.push(`/user/profile?tab=${newTab}`);
  };

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
    <div className="space-y-4">
      <div className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-sky-300 via-indigo-300 to-amber-200" />

        <div className="-mt-12 px-5 pb-6">
          <div className="flex items-end gap-3">
            <Avatar className="h-20 w-20 border-4 border-slate-50 shadow-sm">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || "Người dùng"} />
              <AvatarFallback className="bg-slate-200 text-xl font-bold text-slate-700">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pb-1">
              <p className="text-xl font-bold text-slate-900">{user?.fullName || "Người dùng"}</p>
              <p className="inline-flex items-center gap-1 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                {user?.email || "Chưa đăng nhập"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <Metric label="Vé" value="--" icon={Ticket} />
            <Metric label="Đánh giá" value="--" icon={UserCircle2} />
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Cài đặt tài khoản
        </p>

        <ul className="space-y-1">
          <li
            onClick={() => handleTabChange('general')}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${tab === 'general' ? 'bg-slate-200/50 text-slate-800' : 'text-slate-500 hover:bg-slate-200/30'}`}
          >
            <Settings2 className={`h-4 w-4 ${tab === 'general' ? 'text-slate-700' : 'text-slate-400'}`} />
            Chung
          </li>
          <li
            onClick={() => handleTabChange('security')}
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer transition-colors ${tab === 'security' ? 'bg-slate-200/50 text-slate-800' : 'text-slate-500 hover:bg-slate-200/30'}`}
          >
            <Shield className={`h-4 w-4 ${tab === 'security' ? 'text-slate-700' : 'text-slate-400'}`} />
            Quyền riêng tư & bảo mật
          </li>
        </ul>

        {isUserRole && !user?.organizerId && (
          <Button
            variant="outline"
            className="mt-6 h-11 w-full rounded-2xl border-sky-200 bg-sky-50 font-semibold text-sky-700 hover:bg-sky-100 shadow-none hover:shadow-sm transition-all"
            asChild
          >
            <Link href="/user/dashboard/organizer/create">
              <Rocket className="h-4 w-4 mr-2" />
              Đăng ký nhà tổ chức
            </Link>
          </Button>
        )}

        {user?.organizerId && (
          <div
            className={`mt-6 flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold ${statusConfig?.className || "border-slate-200 bg-white text-slate-600 shadow-sm"
              }`}
          >
            {isOrganizerLoading ? (
              <span>Đang tải trạng thái...</span>
            ) : statusConfig ? (
              <>
                <statusConfig.icon className="h-4 w-4 shrink-0" />
                <span>{statusConfig.label}</span>
              </>
            ) : (
              <span>Đang cập nhật trạng thái...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/50 p-3 text-center transition-colors hover:bg-white">
      <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        <Icon className="h-3 w-3 text-sky-500" />
        {label}
      </p>
      <p className="mt-1 text-lg font-black text-slate-800">{value}</p>
    </div>
  );
}
