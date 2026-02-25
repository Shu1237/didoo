"use client";

import EventsList from "./_components/EventsList";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { useGetEvents } from "@/hooks/useEvent";
import Loading from "@/components/loading";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BasePagination } from "@/components/base/BasePagination";
import BaseFilterHeader, { FilterHeaderConfig } from "@/components/base/BaseFilterHeader";
import { EventStatus } from "@/utils/enum";

export default function AdminEventsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const name = searchParams.get("name") || "";
  const statusRaw = searchParams.get("status");
  const status = statusRaw && statusRaw !== "ALL" ? (Number(statusRaw) as EventStatus) : undefined;

  const { data: eventsRes, isLoading } = useGetEvents({
    PageNumber: pageNumber,
    PageSize: pageSize,
    Name: name,
    Status: status,
  });

  const filterConfigs: FilterHeaderConfig[] = [
    {
      key: "name",
      label: "Tên sự kiện",
      type: "text",
      placeholder: "Tìm kiếm...",
      width: "140px"
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Bản nháp", value: EventStatus.DRAFT },
        { label: "Đang diễn ra", value: EventStatus.PUBLISHED },
        { label: "Đã hủy", value: EventStatus.CANCELLED },
        { label: "Đã hoàn thành", value: EventStatus.COMPLETED },
      ]
    }
  ];

  const events = eventsRes?.data?.items || [];
  const totalCount = eventsRes?.data?.totalItems || 0;
  const totalPage = eventsRes?.data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNumber", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", size.toString());
    params.set("pageNumber", "1"); // Reset to page 1 when changing size
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full h-full">
      <div className="flex-none pb-6">
        <AdminPageHeader
          title="Quản lý sự kiện"
          description="Xem và phê duyệt các sự kiện trên nền tảng"
        >
          <BaseFilterHeader filters={filterConfigs}>
            <BasePagination
              currentPage={pageNumber}
              totalPages={totalPage}
              itemsPerPage={pageSize}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[10, 20, 50]}
              showInfo={false}
              showNavigation={false}
              showSizeSelector={true}
            />
          </BaseFilterHeader>
        </AdminPageHeader>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 -mr-2 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-3xl border border-zinc-100 border-dashed mt-4">
            <Loading text="Đang tải dữ liệu..." />
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              <EventsList events={events} />
            </div>

            {(events.length > 0) && (
              <div className="mt-4 mb-4 flex justify-end">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-1.5 border border-zinc-100 shadow-sm">
                  <BasePagination
                    currentPage={pageNumber}
                    totalPages={totalPage}
                    totalItems={totalCount}
                    itemsPerPage={pageSize}
                    onPageChange={handlePageChange}
                    showInfo={false}
                    showSizeSelector={false}
                    showNavigation={true}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
