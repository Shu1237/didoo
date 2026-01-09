"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ProfileForm() {
  const user = useSessionStore((state) => state.user);

  // TODO: Implement profile update logic
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Tên
          </label>
          <Input
            id="name"
            defaultValue={user?.name || ""}
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            defaultValue={user?.email || ""}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email không thể thay đổi
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Hủy
          </Button>
          <Button type="submit">Lưu thay đổi</Button>
        </div>
      </form>
    </Card>
  );
}
