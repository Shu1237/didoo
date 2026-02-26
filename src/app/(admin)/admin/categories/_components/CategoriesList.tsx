"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Category } from "@/types/category";
import { useCategory } from "@/hooks/useCategory";
import { CategoryStatus } from "@/utils/enum";
import { MoreVertical, Pencil, Trash2, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorApi } from "@/lib/errors";

interface CategoriesListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export default function CategoriesList({ categories, onEdit }: CategoriesListProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const { deleteCategory, restore } = useCategory();

  const handleDelete = async (cat: Category) => {
    try {
      await deleteCategory.mutateAsync(cat.id);
      setDeleteConfirm(null);
    } catch (e) {
      handleErrorApi({ error: e });
    }
  };

  const handleRestore = async (cat: Category) => {
    try {
      await restore.mutateAsync(cat.id);
    } catch (e) {
      handleErrorApi({ error: e });
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <Card className="p-16 text-center bg-white/50 backdrop-blur-sm border-zinc-200 border-dashed shadow-none rounded-[32px]">
        <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Chưa có danh mục nào.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {categories.map((cat) => (
        <Card key={cat.id} className="p-4 bg-white border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px] border group">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden border border-zinc-200">
                {cat.iconUrl ? (
                  <img src={cat.iconUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-zinc-400">{cat.name?.[0] || "?"}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-[13px] text-zinc-900 leading-tight">{cat.name}</p>
                  <Badge variant="secondary" className="bg-zinc-50 text-zinc-500 border-zinc-100 rounded-full px-2 py-0 text-[10px] font-bold uppercase tracking-widest">
                    {cat.slug}
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{cat.description || "Không có mô tả"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge
                className={`rounded-full px-2.5 py-0.5 border-none pointer-events-none uppercase text-[8px] tracking-widest font-bold ${
                  cat.status === CategoryStatus.ACTIVE ? "bg-emerald-500 text-white" : "bg-zinc-400 text-white"
                }`}
              >
                {cat.status === CategoryStatus.ACTIVE ? "Hoạt động" : "Ẩn"}
              </Badge>
              <Button
                onClick={() => onEdit(cat)}
                variant="ghost"
                size="sm"
                className="rounded-full h-9 w-9 p-0"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  {cat.isDeleted ? (
                    <DropdownMenuItem onClick={() => handleRestore(cat)} className="gap-2">
                      <RotateCcw className="w-4 h-4" /> Khôi phục
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => setDeleteConfirm(cat)} className="gap-2 text-red-600 focus:text-red-600">
                      <Trash2 className="w-4 h-4" /> Xóa
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}

      <ConfirmModal
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="Xóa danh mục"
        description={deleteConfirm ? `Bạn có chắc chắn muốn xóa danh mục "${deleteConfirm.name}"?` : ""}
        confirmLabel="Xóa"
        variant="danger"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}
