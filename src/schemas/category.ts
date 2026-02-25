import { z } from "zod";
import { CategoryStatus } from "@/utils/enum";

export const categoryCreateSchema = z.object({
    Name: z.string().min(1, "Tên danh mục là bắt buộc"),
    Slug: z.string().min(1, "Slug là bắt buộc"),
    Description: z.string().optional().or(z.literal("")),
    IconUrl: z.string().url("Link icon không hợp lệ").optional().or(z.literal("")),
    Status: z.nativeEnum(CategoryStatus).default(CategoryStatus.ACTIVE),
    ParentCategoryId: z.string().nullable().optional(),
});

export const categoryUpdateSchema = z.object({
    Name: z.string().min(1).optional(),
    Slug: z.string().optional(),
    Description: z.string().optional(),
    IconUrl: z.string().url().optional().or(z.literal("")),
    Status: z.nativeEnum(CategoryStatus).optional(),
    ParentCategoryId: z.string().nullable().optional(),
    IsDeleted: z.boolean().optional(),
});


export type CategoryCreateBody = z.input<typeof categoryCreateSchema>;
export type CategoryUpdateBody = z.input<typeof categoryUpdateSchema>;



