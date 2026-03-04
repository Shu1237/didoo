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
import { useGetCategories } from "@/hooks/useCategory";
import { CategoryStatus } from "@/utils/enum";
import type { Category } from "@/types/category";
import CategoriesList from "./_components/CategoriesList";
import CategoryModal from "./_components/CategoryModal";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showDeleted, setShowDeleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const name = searchParams.get("name") || "";
  const statusRaw = searchParams.get("status");
  const status = statusRaw && statusRaw !== "ALL" ? (Number(statusRaw) as CategoryStatus) : undefined;

  const { data: categoriesRes, isLoading } = useGetCategories({
    pageNumber,
    pageSize,
    name: name || undefined,
    status,
    isDeleted: showDeleted,
  });

  const filterConfigs: FilterHeaderConfig[] = [
    {
      key: "name",
      label: "Danh mục",
      type: "text",
      placeholder: "Tìm tên danh mục",
      width: "220px",
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      options: [
        { label: "Hoạt động", value: CategoryStatus.ACTIVE },
        { label: "Ẩn", value: CategoryStatus.INACTIVE },
      ],
    },
  ];

  const categories = categoriesRes?.data?.items || [];
  const totalCount = categoriesRes?.data?.totalItems || 0;
  const totalPage = categoriesRes?.data?.totalPages || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", size.toString());
    params.set("pageNumber", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden lg:gap-6">
      <AdminPageHeader
        title="Quản lý danh mục"
        description="Thêm, chỉnh sửa và kiểm soát danh mục sự kiện"
        badge={`${totalCount} danh mục`}
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

        <Button
          onClick={() => {
            setEditingCategory(null);
            setModalOpen(true);
          }}
          className="h-9 rounded-xl px-3 text-xs"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Thêm danh mục
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
            <Loading text="Đang tải danh sách danh mục" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center text-sm text-zinc-500">Không có dữ liệu danh mục.</div>
        ) : (
          <>
            <div className="max-h-[min(58vh,680px)] overflow-y-auto p-3 lg:p-4">
              <CategoriesList
                categories={categories}
                onEdit={(category) => {
                  setEditingCategory(category);
                  setModalOpen(true);
                }}
              />
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

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
}
