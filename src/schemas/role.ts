import { z } from "zod";


export const genericListQuerySchema = z.object({
    pageNumber: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(20),
    isDeleted: z.boolean().default(false),
});

/** api.md: name is RoleNameEnum 1=Admin, 2=User, 3=Manager, 4=Guest */
export const roleCreateSchema = z.object({
    name: z.number().int().min(1).max(4),
});

export type RoleCreateBody = z.infer<typeof roleCreateSchema>;
