"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import ProfileForm from "@/app/(user)/user/profile/_components/ProfileForm";
import ProfileSidebar from "@/app/(user)/user/profile/_components/ProfileHeader";

export default function AdminProfilePage() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <AdminPageHeader
        title="Hồ sơ quản trị"
        description="Cập nhật thông tin tài khoản quản trị và cài đặt cá nhân"
      />

      <Card className="min-h-0 flex-1 overflow-y-auto rounded-2xl border-zinc-200 bg-white p-4 shadow-sm lg:p-6">
        <Suspense fallback={<Loading />}>
          <div className="space-y-4">
            <ProfileSidebar />
            <ProfileForm />
          </div>
        </Suspense>
      </Card>
    </div>
  );
}
