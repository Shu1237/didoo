"use client";

import BaseFilter from "@/components/base/BaseFilter";
import type { FilterConfig } from "@/components/base/BaseFilter";
import { useGetEvents } from "@/hooks/useEvent";

const sortOptions = [
  { label: "Mới nhất", value: "true" },
  { label: "Cũ nhất", value: "false" },
];

export function OrganizerEarningsFilters({ organizerId }: { organizerId: string }) {
  const { data: eventsRes } = useGetEvents({ organizerId, pageSize: 200, isDeleted: false });
  const events = eventsRes?.data?.items ?? [];

  const filters: FilterConfig[] = [
    {
      key: "eventId",
      label: "Sự kiện",
      type: "select",
      options: [{ label: "Tất cả", value: "" }, ...events.map((e) => ({ label: e.name, value: e.id }))],
    },
    { key: "isDescending", label: "Sắp xếp", type: "select", options: sortOptions, defaultValue: "true" },
  ];

  return <BaseFilter filters={filters} />;
}
