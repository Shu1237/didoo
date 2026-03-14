"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useGetCategories, useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { ResalePageContent } from "./_components/ResalePageContent";
import { EventStatus } from "@/utils/enum";

export default function ResalePage() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name") ?? "";
  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam && categoryIdParam.trim() ? categoryIdParam : "all";
  const startTimeParam = searchParams.get("startTime");
  const endTimeParam = searchParams.get("endTime");
  const pageNumber = Math.max(
    1,
    Number(searchParams.get("pageNumber") ?? searchParams.get("page") ?? 1)
  );
  const pageSize = Number(searchParams.get("pageSize") ?? 12);

  const query = useMemo(
    () => ({
      pageNumber,
      pageSize,
      hasCategory: true,
      hasOrganizer: true,
      hasLocations: true,
      status: EventStatus.OPENED,
      isDeleted: false,
      ...(name && { name }),
      ...(categoryId !== "all" && { categoryId }),
      ...(startTimeParam && { startTime: startTimeParam }),
      ...(endTimeParam && { endTime: endTimeParam }),
      isDescending: true,
    }),
    [pageNumber, pageSize, name, categoryId, startTimeParam, endTimeParam]
  );

  const { data: eventsResponse, isLoading: isEventsLoading } = useGetEvents(query);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } =
    useGetCategories({ pageSize: 20 });

  const eventsData = eventsResponse?.data;
  const events = eventsData?.items ?? [];
  const totalItems = eventsData?.totalItems ?? 0;
  const totalPages = eventsData?.totalPages ?? 1;
  const currentPage = eventsData?.pageNumber ?? pageNumber;
  const itemsPerPage = eventsData?.pageSize ?? pageSize;

  const allCategories = categoriesResponse?.data.items ?? [];

  if (isEventsLoading || isCategoriesLoading) return <Loading />;

  return (
    <ResalePageContent
      events={events}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      categories={allCategories}
    />
  );
}
