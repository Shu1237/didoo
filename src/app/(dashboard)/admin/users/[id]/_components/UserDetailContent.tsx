"use client";

import { useGetUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDetailContent({ id }: { id: string }) {
  const { data, isLoading } = useGetUser(id);

  if (isLoading || !data?.data) {
    return (
      <Card className="border-zinc-200">
        <CardContent className="pt-6">
          <Skeleton className="h-20 w-20 rounded-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  const user = data.data;

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-900">Thông tin</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatarUrl} />
          <AvatarFallback className="bg-zinc-100 text-lg">{user.fullName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-zinc-500">Họ tên</p>
            <p className="text-zinc-900">{user.fullName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Email</p>
            <p className="text-zinc-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Số điện thoại</p>
            <p className="text-zinc-900">{user.phone ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Vai trò</p>
            <Badge variant="outline" className="border-zinc-200">{user.role?.name ?? "—"}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Trạng thái</p>
            <Badge variant={user.isVerified ? "default" : "secondary"}>
              {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
