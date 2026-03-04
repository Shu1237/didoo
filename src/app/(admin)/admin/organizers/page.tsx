"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import BaseFilterHeader, { type FilterHeaderConfig } from "@/components/base/BaseFilterHeader";
import { BasePagination } from "@/components/base/BasePagination";
import Loading from "@/components/loading";
import { Card } from "@/components/ui/card";
import { useGetOrganizers } from "@/hooks/useOrganizer";
import { OrganizerStatus } from "@/utils/enum";
import OrganizersList from "./_components/OrganizersList";

export default function AdminOrganizersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const name = searchParams.get("name") || "";
  const statusRaw = searchParams.get("status");
  const status = statusRaw && statusRaw !== "ALL" ? (Number(statusRaw) as OrganizerStatus) : undefined;

  const { data: organizersRes, isLoading } = useGetOrganizers({
    pageNumber,
    pageSize,
    name: name || undefined,
    status,
  });

  const filterConfigs: FilterHeaderConfig[] = [
    {
      key: "name",
      label: "Organizer",
      type: "text",
      placeholder: "Tìm tên hoặc email organizer",
      width: "230px",
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Chờ duyệt", value: OrganizerStatus.PENDING },
        { label: "Đã duyệt", value: OrganizerStatus.VERIFIED },
        { label: "Bị khóa", value: OrganizerStatus.BANNED },
      ],
    },
  ];

  const organizers = organizersRes?.data?.items || [];
  const totalCount = organizersRes?.data?.totalItems || 0;
  const totalPage = organizersRes?.data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNumber", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", size.toString());
    params.set("pageNumber", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <AdminPageHeader
        title="Quản lý organizer"
        description="Theo dõi và phê duyệt đơn đăng ký tổ chức sự kiện"
        badge={`${totalCount} organizer`}
      >
        <BaseFilterHeader filters={filterConfigs}>
          <BasePagination
            currentPage={pageNumber}
            totalPages={totalPage}
            itemsPerPage={pageSize}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50]}
            showInfo={false}
            showNavigation={false}
            showSizeSelector={true}
          />
        </BaseFilterHeader>
      </AdminPageHeader>

      <Card className="overflow-hidden rounded-2xl border-zinc-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loading text="Đang tải danh sách organizer" />
          </div>
        ) : organizers.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center text-sm text-zinc-500">Không có dữ liệu organizer.</div>
        ) : (
          <>
            <div className="max-h-[min(58vh,680px)] overflow-y-auto p-3 lg:p-4">
              <OrganizersList organizers={organizers} />
            </div>

            <div className="border-t border-zinc-100 px-3 py-2 lg:px-4">
              <BasePagination
                currentPage={pageNumber}
                totalPages={totalPage}
                totalItems={totalCount}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
                showInfo={true}
                showSizeSelector={false}
                showNavigation={true}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
