"use client";


import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/utils/mockAdmin";



export default function UsersList() {
  const users = mockUsers;

  return (
    <div className="space-y-4">
      {users.map((user: any) => (
        <Card key={user.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name || user.email}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Role: {user.role}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Xem chi tiết</Button>
              <Button variant="outline" size="sm">Khóa</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
