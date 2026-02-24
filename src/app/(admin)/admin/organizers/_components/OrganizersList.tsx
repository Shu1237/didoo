"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Organizer } from "@/types/organizer";
import { useOrganizer } from "@/hooks/useOrganizer";
import { OrganizerStatus } from "@/utils/enum";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import OrganizerModal from "./OrganizerModal";

interface OrganizersListProps {
  organizers: Organizer[];
}

export default function OrganizersList({ organizers }: OrganizersListProps) {
  const { update } = useOrganizer();
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetail = (organizer: Organizer) => {
    setSelectedOrganizer(organizer);
    setIsModalOpen(true);
  };

  const handleAction = async (organizer: Organizer, status: OrganizerStatus) => {
    const actionName = status === OrganizerStatus.ACTIVE ? "Phê duyệt & Xác minh" : "Từ chối";
    let message = `Bạn có chắc chắn muốn ${actionName.toLowerCase()} organizer "${organizer.name}" không?`;

    if (status === OrganizerStatus.ACTIVE && !organizer.isVerified) {
      message += "\n\nLƯU Ý: Thao tác này sẽ đồng thời XÁC MINH danh tính cho Organizer này.";
    }

    if (!window.confirm(message)) return;

    try {
      await update.mutateAsync({
        id: organizer.id,
        body: {
          Status: status,
          IsVerified: status === OrganizerStatus.ACTIVE ? true : undefined
        }
      });
    } catch (err) { }
  };

  if (!organizers || organizers.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-zinc-200 shadow-sm rounded-3xl">
        <p className="text-zinc-500 mb-4">Chưa có đơn đăng ký organizer nào</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {organizers.map((organizer) => (
        <Card key={organizer.id} className="p-2.5 bg-white border-zinc-200 shadow-sm rounded-2xl hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <Avatar className="w-9 h-9 shrink-0 border border-zinc-50 shadow-sm">
                <AvatarImage src={organizer.logoUrl || ""} />
                <AvatarFallback className="text-zinc-600 font-bold bg-zinc-100 text-xs text-secondary-foreground">
                  {organizer.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="font-bold text-xs truncate tracking-tight text-zinc-900">{organizer.name}</p>
                    {organizer.isVerified && (
                      <Badge className="bg-blue-500 text-white border-none h-3.5 px-1 py-0 rounded-full flex items-center shrink-0">
                        <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                        </svg>
                      </Badge>
                    )}
                  </div>
                  <Badge
                    className={`text-white hover:text-white shrink-0 rounded-full px-1.5 py-0 border-none pointer-events-none text-[8px] font-black uppercase tracking-[0.05em] ${organizer.status === OrganizerStatus.PENDING
                      ? "bg-amber-500"
                      : organizer.status === OrganizerStatus.ACTIVE
                        ? "bg-emerald-500"
                        : "bg-rose-500"
                      }`}
                  >
                    {organizer.status === OrganizerStatus.PENDING
                      ? "Chờ phê duyệt"
                      : organizer.status === OrganizerStatus.ACTIVE
                        ? "Đã phê duyệt"
                        : "Từ chối"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider truncate max-w-[150px]">{organizer.email}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDetail(organizer)}
                className="border-zinc-200 text-zinc-700 rounded-xl px-2.5 h-7 text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-50"
              >
                Chi tiết
              </Button>
              {organizer.status === OrganizerStatus.PENDING && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={update.isPending}
                    onClick={() => handleAction(organizer, OrganizerStatus.ACTIVE)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl px-2.5 h-7 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {update.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Duyệt"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={update.isPending}
                    onClick={() => handleAction(organizer, OrganizerStatus.REJECTED)}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-2.5 h-7 text-[10px] font-bold uppercase tracking-wider"
                  >
                    {update.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Từ chối"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}

      <OrganizerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        organizer={selectedOrganizer}
        onApprove={(org) => handleAction(org, OrganizerStatus.ACTIVE)}
        onReject={(org) => handleAction(org, OrganizerStatus.REJECTED)}
        isUpdating={update.isPending}
      />
    </div>
  );
}
