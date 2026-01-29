"use client";

import { useSessionStore } from "@/stores/sesionStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Save, X } from "lucide-react";

export default function ProfileForm() {
  const user = useSessionStore((state) => state.user);

  // TODO: Implement profile update logic
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="grid gap-6">
      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="bg-muted/30 pb-8">
          <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
          <CardDescription>Cập nhật thông tin hồ sơ của bạn ở đây.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Tên hiển thị
                </label>
                <Input
                  id="name"
                  defaultValue={user?.name || ""}
                  placeholder="Nhập tên của bạn"
                  className="bg-background/80 border-input/60 focus:bg-background transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ""}
                  disabled
                  className="bg-muted/50 opacity-70 cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                  Không thể thay đổi
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
              <Button type="button" variant="ghost" className="hover:bg-destructive/10 hover:text-destructive">
                <X className="w-4 h-4 mr-2" />
                Hủy
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
