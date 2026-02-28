"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CategoryCreateBody, categoryCreateSchema, categoryUpdateSchema } from "@/schemas/category";
import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/category";
import { handleErrorApi } from "@/lib/errors";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryStatus } from "@/utils/enum";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSuccess?: () => void;
}

export default function CategoryModal({ isOpen, onClose, category, onSuccess }: CategoryModalProps) {
  const isEdit = !!category;
  const { create, update } = useCategory();

  const form = useForm<CategoryCreateBody>({
    resolver: zodResolver(isEdit ? categoryUpdateSchema : categoryCreateSchema) as any,
    defaultValues: {
      Name: "",
      Slug: "",
      Description: "",
      IconUrl: "",
      Status: CategoryStatus.ACTIVE,
      ParentCategoryId: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        form.reset({
          Name: category.name,
          Slug: category.slug,
          Description: category.description || "",
          IconUrl: category.iconUrl || "",
          Status: category.status as CategoryStatus,
          ParentCategoryId: (category as any).parentCategoryId || null,
        });
      } else {
        form.reset({
          Name: "",
          Slug: "",
          Description: "",
          IconUrl: "",
          Status: CategoryStatus.ACTIVE,
          ParentCategoryId: null,
        });
      }
    }
  }, [isOpen, category, form]);

  const onSubmit = async (data: CategoryCreateBody) => {
    try {
      if (isEdit) {
        await update.mutateAsync({ id: category!.id, body: data });
      } else {
        await create.mutateAsync(data);
      }
      onSuccess?.();
      onClose();
    } catch (e) {
      handleErrorApi({ error: e });
    }
  };

  const handleSlugFromName = () => {
    const name = form.getValues("Name");
    if (name) {
      form.setValue("Slug", name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-[24px] border-zinc-100 bg-white p-0 overflow-hidden shadow-xl">
        <DialogHeader className="p-6 border-b border-zinc-100">
          <DialogTitle className="text-xl font-bold">
            {isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <Label>Tên danh mục *</Label>
            <Input
              {...form.register("Name")}
              placeholder="VD: Âm nhạc & Concerts"
              className="mt-1 h-11 rounded-xl"
              onBlur={handleSlugFromName}
            />
            {form.formState.errors.Name && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.Name.message}</p>
            )}
          </div>
          <div>
            <Label>Slug *</Label>
            <Input
              {...form.register("Slug")}
              placeholder="am-nhac-concerts"
              className="mt-1 h-11 rounded-xl"
            />
            {form.formState.errors.Slug && (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.Slug.message}</p>
            )}
          </div>
          <div>
            <Label>Mô tả</Label>
            <Textarea
              {...form.register("Description")}
              placeholder="Mô tả ngắn gọn..."
              className="mt-1 min-h-[80px] rounded-xl"
            />
          </div>
          <div>
            <Label>URL biểu tượng</Label>
            <Input
              {...form.register("IconUrl")}
              placeholder="https://..."
              className="mt-1 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={String(form.watch("Status"))}
              onValueChange={(v) => form.setValue("Status", Number(v) as CategoryStatus)}
            >
              <SelectTrigger className="mt-1 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(CategoryStatus.ACTIVE)}>Hoạt động</SelectItem>
                <SelectItem value={String(CategoryStatus.INACTIVE)}>Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Hủy
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-primary/90" disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
