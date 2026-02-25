"use client";

import { useState } from "react";
import CategoriesList from "./_components/CategoriesList";
import AdminPageHeader from "@/components/layout/admin/AdminPageHeader";
import { useGetCategories } from "@/hooks/useCategory";
import Loading from "@/components/loading";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { BasePagination } from "@/components/base/BasePagination";
import BaseFilterHeader, { FilterHeaderConfig } from "@/components/base/BaseFilterHeader";
import { CategoryStatus } from "@/utils/enum";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryModal from "./_components/CategoryModal";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const name = searchParams.get("name") || "";
  const statusRaw = searchParams.get("status");
  const status = statusRaw && statusRaw !== "ALL" ? (Number(statusRaw) as CategoryStatus) : undefined;
  const [showDeleted, setShowDeleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const { data: categoriesRes, isLoading } = useGetCategories({
    pageNumber,
    pageSize,
    name: name || undefined,
    status,
    isDeleted: showDeleted,
  });

  const filterConfigs: FilterHeaderConfig[] = [
    { key: "name", label: "Tên danh mục", type: "text", placeholder: "Tìm kiếm...", width: "160px" },
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
    router.push(`${pathname}?${params}`);
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", size.toString());
    params.set("pageNumber", "1");
    router.push(`${pathname}?${params}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full h-full">
      <div className="flex-none pb-6">
        <AdminPageHeader
          title="Quản lý danh mục"
          description="Thêm, sửa và quản lý các danh mục sự kiện"
        >
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                className="rounded border-zinc-300"
              />
              Xem đã xóa
            </label>
            <Button
              onClick={() => { setEditingCategory(null); setModalOpen(true); }}
              className="rounded-full h-9 px-4 bg-primary hover:bg-primary/90 text-white font-bold text-xs"
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm danh mục
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
          </div>
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
              <CategoriesList
                categories={categories}
                onEdit={(cat) => { setEditingCategory(cat); setModalOpen(true); }}
              />
            </div>

            {categories.length > 0 && (
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

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingCategory(null); }}
        category={editingCategory}
        onSuccess={() => setModalOpen(false)}
      />
    </div>
  );
}
