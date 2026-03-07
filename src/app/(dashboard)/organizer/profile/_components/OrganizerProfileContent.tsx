"use client";

import { useGetMe } from "@/hooks/useUser";
import { useGetOrganizer } from "@/hooks/useOrganizer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export function OrganizerProfileContent() {
  const { data: meRes, isLoading: isMeLoading } = useGetMe();
  const user = meRes?.data;
  const organizerId = user?.organizerId ?? undefined;
  const { data: orgRes, isLoading: isOrgLoading } = useGetOrganizer(organizerId ?? "");

  const organizer = orgRes?.data;
  const isLoading = isMeLoading || (!!organizerId && isOrgLoading);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-zinc-200">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">Thông tin cá nhân</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-zinc-100 text-lg">{user?.fullName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <p className="text-sm font-medium text-zinc-500">Họ tên</p>
            <p className="text-zinc-900">{user?.fullName}</p>
            <p className="text-sm font-medium text-zinc-500">Email</p>
            <p className="text-zinc-900">{user?.email}</p>
            {user?.phone && (
              <>
                <p className="text-sm font-medium text-zinc-500">Số điện thoại</p>
                <p className="text-zinc-900">{user.phone}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {organizer && (
        <Card className="border-zinc-200">
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-900">Thông tin tổ chức</h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar className="h-20 w-20">
              <AvatarImage src={organizer.logoUrl} />
              <AvatarFallback className="bg-zinc-100 text-lg">{organizer.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500">Tên tổ chức</p>
              <p className="text-zinc-900">{organizer.name}</p>
              <p className="text-sm font-medium text-zinc-500">Email</p>
              <p className="text-zinc-900">{organizer.email}</p>
              {organizer.phone && (
                <>
                  <p className="text-sm font-medium text-zinc-500">Số điện thoại</p>
                  <p className="text-zinc-900">{organizer.phone}</p>
                </>
              )}
              {organizer.address && (
                <>
                  <p className="text-sm font-medium text-zinc-500">Địa chỉ</p>
                  <p className="text-zinc-900">{organizer.address}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
