import { z } from "zod";


export const genericListQuerySchema = z.object({
    pageNumber: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(20),
    isDeleted: z.boolean().default(false),
});

export const roleCreateSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export type RoleCreateBody = z.infer<typeof roleCreateSchema>;
