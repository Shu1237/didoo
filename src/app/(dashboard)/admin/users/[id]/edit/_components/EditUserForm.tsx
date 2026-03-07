"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema, type UserUpdateBody } from "@/schemas/user";
import { useUser } from "@/hooks/useUser";
import { useGetUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleErrorApi } from "@/lib/errors";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function EditUserForm({ id }: { id: string }) {
  const router = useRouter();
  const { update } = useUser();
  const { data: userRes, isLoading } = useGetUser(id);
  const user = userRes?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdateBody>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      FullName: "",
      Phone: "",
      Address: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        FullName: user.fullName,
        Phone: user.phone ?? "",
        Address: user.address ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserUpdateBody) => {
    try {
      await update.mutateAsync({ id, body: data });
      router.push("/admin/users");
    } catch (err) {
      handleErrorApi({ error: err });
    }
  };

  if (isLoading || !user) {
    return (
      <Card className="border-zinc-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-900">Thông tin người dùng</h2>
        <p className="text-sm text-zinc-500">Email: {user.email}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="FullName">Họ tên</Label>
            <Input
              id="FullName"
              {...register("FullName")}
              className={errors.FullName ? "border-destructive" : ""}
            />
            {errors.FullName && (
              <p className="text-sm text-destructive">{errors.FullName.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="Phone">Số điện thoại</Label>
              <Input id="Phone" {...register("Phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Address">Địa chỉ</Label>
              <Input id="Address" {...register("Address")} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/users">Hủy</Link>
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
