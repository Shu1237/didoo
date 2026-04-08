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
  const firstEventId = events[0]?.id;

  const filters: FilterConfig[] = [
    {
      key: "eventId",
      label: "Sự kiện",
      type: "select",
      options: events.map((e) => ({ label: e.name, value: e.id })),
      defaultValue: firstEventId,
    },
    { key: "isDescending", label: "Sắp xếp", type: "select", options: sortOptions, defaultValue: "true" },
  ];

  return <BaseFilter filters={filters} />;
}
