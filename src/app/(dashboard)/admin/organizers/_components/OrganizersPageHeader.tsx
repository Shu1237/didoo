"use client";

import { SectionHeader } from "@/components/base/SectionHeader";

export function OrganizersPageHeader() {
  return (
    <SectionHeader
      title="Organizer"
      subtitle="Quản lý tổ chức sự kiện"
      createHref="/admin/organizers/create"
      createLabel="Tạo organizer"
    />
  );
}
