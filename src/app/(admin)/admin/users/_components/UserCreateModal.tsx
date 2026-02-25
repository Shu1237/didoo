"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userCreateSchema, UserCreateBody } from "@/schemas/user";
import { useUser } from "@/hooks/useUser";
import { handleErrorApi } from "@/lib/errors";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function UserCreateModal({ isOpen, onClose, onSuccess }: UserCreateModalProps) {
  const { create } = useUser();

  const form = useForm<UserCreateBody>({
    resolver: zodResolver(userCreateSchema) as any,
    defaultValues: {
      FullName: "",
      Email: "",
      Phone: "",
      Password: "",
      Gender: 0,
      DateOfBirth: new Date("1990-01-01"),
      Address: "",
      Status: 1,
      RoleName: 2,
    },
  });

  const onSubmit = async (data: UserCreateBody) => {
    try {
      await create.mutateAsync(data);
      onSuccess?.();
      onClose();
      form.reset();
    } catch (e) {
      handleErrorApi({ error: e });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[24px] border-zinc-100 bg-white p-0 overflow-hidden shadow-xl">
        <DialogHeader className="p-6 border-b border-zinc-100">
          <DialogTitle className="text-xl font-bold">Thêm người dùng mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <Label>Họ tên *</Label>
            <Input {...form.register("FullName")} placeholder="Nguyễn Văn A" className="mt-1 h-11 rounded-xl" />
            {form.formState.errors.FullName && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.FullName.message}</p>
            )}
          </div>
          <div>
            <Label>Email *</Label>
            <Input {...form.register("Email")} type="email" placeholder="user@example.com" className="mt-1 h-11 rounded-xl" />
            {form.formState.errors.Email && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.Email.message}</p>
            )}
          </div>
          <div>
            <Label>Mật khẩu *</Label>
            <Input {...form.register("Password")} type="password" placeholder="Tối thiểu 6 ký tự" className="mt-1 h-11 rounded-xl" />
            {form.formState.errors.Password && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.Password.message}</p>
            )}
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input {...form.register("Phone")} placeholder="0987654321" className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Vai trò</Label>
            <Select value={String(form.watch("RoleName"))} onValueChange={(v) => form.setValue("RoleName", Number(v))}>
              <SelectTrigger className="mt-1 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Admin</SelectItem>
                <SelectItem value="2">User</SelectItem>
                <SelectItem value="3">Manager</SelectItem>
                <SelectItem value="4">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select value={String(form.watch("Status"))} onValueChange={(v) => form.setValue("Status", Number(v))}>
              <SelectTrigger className="mt-1 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="2">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Hủy
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary/90" disabled={create.isPending}>
              {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
