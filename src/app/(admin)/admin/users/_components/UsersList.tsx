"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UsersListProps {
  users: {
    id: string;
    name: string;
    email: string;
    role: string;
  }[];
}

export default function UsersList({ users }: UsersListProps) {
  if (!users || users.length === 0) {
    return (
      <Card className="p-12 text-center bg-white border-zinc-200 shadow-sm">
        <p className="text-zinc-500">Không có người dùng nào để hiển thị.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id} className="p-4 bg-white border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-900">{user.name || user.email}</p>
              <p className="text-sm text-zinc-500">{user.email}</p>
              <p className="text-xs text-zinc-500 mt-1">Role: {user.role}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700">
                Xem chi tiết
              </Button>
              <Button variant="outline" size="sm" className="border-zinc-200 text-zinc-700">
                Khóa
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
