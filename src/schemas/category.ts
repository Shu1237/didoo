import { z } from "zod";
import { CategoryStatus } from "@/utils/enum";

export const categoryCreateSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    iconUrl: z.string().url().optional(),
    status: z.enum(CategoryStatus).default(CategoryStatus.ACTIVE),
    parentCategoryId: z.uuid().nullable().optional(),
});

export const categoryUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    iconUrl: z.string().url().optional(),
    status: z.enum(CategoryStatus).optional(),
    parentCategoryId: z.uuid().nullable().optional(),
});


export type CategoryCreateBody = z.input<typeof categoryCreateSchema>;
export type CategoryUpdateBody = z.input<typeof categoryUpdateSchema>;



