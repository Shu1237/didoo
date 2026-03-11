"use client";

import { SectionHeader } from "@/components/base/SectionHeader";

export function EventsPageHeader() {
  return (
    <SectionHeader
      title="Sự kiện"
      subtitle="Quản lý sự kiện hệ thống"
      createHref="/admin/events/create"
      createLabel="Tạo sự kiện"
    />
  );
}
