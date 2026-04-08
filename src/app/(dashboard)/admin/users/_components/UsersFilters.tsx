"use client";

import BaseFilter from "@/components/base/BaseFilter";
import type { FilterConfig } from "@/components/base/BaseFilter";

const statusOptions = [
  { label: "Tất cả", value: "" },
  { label: "Active", value: "1" },
  { label: "Inactive", value: "0" },
];

const sortOptions = [
  { label: "Mới nhất", value: "true" },
  { label: "Cũ nhất", value: "false" },
];

export function UsersFilters({ params }: { params: Record<string, string | string[] | undefined> }) {
  const filters: FilterConfig[] = [
    { key: "fullName", label: "Họ tên", type: "text", placeholder: "Tìm theo tên" },
    { key: "email", label: "Email", type: "text", placeholder: "Tìm theo email" },
    { key: "phone", label: "SĐT", type: "text", placeholder: "Tìm theo SĐT" },
    { key: "status", label: "Trạng thái", type: "select", options: statusOptions },
    { key: "isDescending", label: "Sắp xếp", type: "select", options: sortOptions, defaultValue: "true" },
  ];

  return <BaseFilter filters={filters} />;
}
