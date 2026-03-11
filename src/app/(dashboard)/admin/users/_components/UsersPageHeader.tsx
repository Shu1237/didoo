"use client";

import { SectionHeader } from "@/components/base/SectionHeader";

export function UsersPageHeader() {
  return (
    <SectionHeader
      title="Người dùng"
      subtitle="Quản lý tài khoản người dùng"
      createHref="/admin/users/create"
      createLabel="Tạo người dùng"
    />
  );
}
