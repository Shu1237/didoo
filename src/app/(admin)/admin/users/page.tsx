"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import BaseFilterHeader, { type FilterHeaderConfig } from "@/components/base/BaseFilterHeader";
import { BasePagination } from "@/components/base/BasePagination";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetUsers } from "@/hooks/useUser";
import UsersList from "./_components/UsersList";
import UserCreateModal from "./_components/UserCreateModal";

export default function AdminUsersPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const name = searchParams.get("name") || "";

  const { data: usersRes, isLoading } = useGetUsers({
    pageNumber,
    pageSize,
    fullName: name || undefined,
    isDeleted: showDeleted,
    roleId: "5d27bad4-a1c0-40eb-b365-5e8ab2ca1d66",
  });

  const filterConfigs: FilterHeaderConfig[] = [
    {
      key: "name",
      label: "Người dùng",
      type: "text",
      placeholder: "Tìm kiếm tên hoặc email",
      width: "220px",
    },
  ];

  const users = usersRes?.data?.items || [];
  const totalCount = usersRes?.data?.totalItems || 0;
  const totalPage = usersRes?.data?.totalPages || 1;

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
        title="Quản lý người dùng"
        description="Xem và quản trị danh sách tài khoản người dùng trên hệ thống"
        badge={`${totalCount} tài khoản`}
      >
        <label className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
          <input
            type="checkbox"
            checked={showDeleted}
            onChange={(event) => setShowDeleted(event.target.checked)}
            className="rounded border-zinc-300"
          />
          Xem đã xóa
        </label>

        <Button onClick={() => setCreateModalOpen(true)} className="h-9 rounded-xl px-3 text-xs">
          <Plus className="mr-1.5 h-4 w-4" />
          Thêm người dùng
        </Button>

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

      <Card className="overflow-hidden rounded-2xl border-zinc-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Loading text="Đang tải danh sách người dùng" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center text-sm text-zinc-500">Không có dữ liệu người dùng.</div>
        ) : (
          <>
            <div className="max-h-[min(58vh,680px)] overflow-y-auto p-3 lg:p-4">
              <UsersList users={users} />
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

      <UserCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
