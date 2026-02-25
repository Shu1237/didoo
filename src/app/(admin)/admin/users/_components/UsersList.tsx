"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Lock, Unlock, ArrowRight, MoreVertical, Trash2, RotateCcw } from "lucide-react";
import { User } from "@/types/user";
import { useUser } from "@/hooks/useUser";
import UserDetailModal from "./UserDetailModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorApi } from "@/lib/errors";

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { update, deleteUser, restore } = useUser();

  const handleToggleStatus = (user: User) => {
    const isBlocked = user.status === 2;
    const newStatus = isBlocked ? 1 : 2;
    update.mutate({ id: user.id, body: { Status: newStatus } });
  };

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Xóa người dùng "${user.fullName}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await deleteUser.mutateAsync(user.id);
    } catch (e) {
      handleErrorApi({ error: e });
    }
  };

  const handleRestore = async (user: User) => {
    try {
      await restore.mutateAsync(user.id);
    } catch (e) {
      handleErrorApi({ error: e });
    }
  };

  if (!users || users.length === 0) {
    return (
      <Card className="p-16 text-center bg-white/50 backdrop-blur-sm border-zinc-200 border-dashed shadow-none rounded-[32px]">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Không có người dùng nào để hiển thị.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user) => {
        const isBlocked = user.status === 2;
        return (
          <Card key={user.id} className="p-4 bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px] border group">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm shrink-0">
                  <AvatarImage src={user.avatarUrl || ""} />
                  <AvatarFallback className="font-bold bg-zinc-100 text-zinc-500 uppercase">
                    {user.fullName?.[0] || user.email[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-[13px] text-zinc-900 leading-tight">
                      {user.fullName || "N/A"}
                    </p>
                    {user.isVerified && (
                      <Shield className="w-3 h-3 text-blue-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider truncate">
                      {user.email}
                    </p>
                    <span className="w-1 h-1 bg-zinc-200 rounded-full shrink-0" />
                    <Badge variant="secondary" className="bg-zinc-50 text-zinc-500 border-zinc-100 rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-widest">
                      {user.role?.name || "User"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge
                  className={`hidden md:flex rounded-full px-2.5 py-0.5 border-none pointer-events-none uppercase text-[8px] tracking-widest font-bold ${isBlocked ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                    }`}
                >
                  {user.status === 1 ? "Active" : "Inactive"}
                </Badge>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedUser(user)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-zinc-100 text-zinc-600 rounded-full px-4 h-9 text-xs font-bold hidden sm:flex items-center gap-2 group-hover:bg-zinc-900 group-hover:text-white transition-all shadow-zinc-200"
                  >
                    Chi tiết
                    <ArrowRight className="w-3 h-3" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleStatus(user)}
                    disabled={update.isPending}
                    className={`rounded-full w-9 h-9 border-zinc-200 transition-all active:scale-90 ${isBlocked
                      ? "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 border-emerald-100"
                      : "text-rose-500 hover:bg-rose-50 hover:text-rose-600 border-rose-100"
                      }`}
                  >
                    {isBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full w-9 h-9 border-zinc-200">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      {user.isDeleted ? (
                        <DropdownMenuItem onClick={() => handleRestore(user)} className="gap-2">
                          <RotateCcw className="w-4 h-4" /> Khôi phục
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleDelete(user)}
                          className="gap-2 text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      <UserDetailModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
        onToggleStatus={handleToggleStatus}
        isUpdating={update.isPending}
      />
    </div>
  );
}
