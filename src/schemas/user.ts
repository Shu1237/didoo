import { z } from "zod";
import { Roles } from "@/utils/enum";

// Shared schemas
export const locationSchema = z.object({
    name: z.string().optional(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});

/** api.md: status 1=Active 2=Inactive, roleName 1=Admin 2=User 3=Manager 4=Guest */
export const userCreateSchema = z.object({
    FullName: z.string().min(1, "Full name is required"),
    Email: z.string().email(),
    Phone: z.string().optional(),
    Password: z.string().min(6),
    AvatarUrl: z.string().url().optional(),
    Gender: z.number().int().min(0).max(2).default(0),
    DateOfBirth: z.coerce.date(),
    Address: z.string().optional(),
    Status: z.number().int().min(1).max(2).default(1),
    RoleName: z.number().int().min(1).max(4).default(2),
    OrganizerId: z.string().uuid().nullable().optional(),
});

export const userUpdateSchema = z.object({
    FullName: z.string().optional(),
    Phone: z.string().optional(),
    AvatarUrl: z.string().url().nullable().optional(),
    Gender: z.number().int().min(0).max(2).optional(),
    DateOfBirth: z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        z.coerce.date().optional()
    ),
    Address: z.string().optional(),
    Status: z.number().int().min(1).max(2).optional(),
    RoleName: z.number().int().min(1).max(4).optional(),
    OrganizerId: z.string().uuid().nullable().optional(),
});



export type UserCreateBody = z.input<typeof userCreateSchema>;
export type UserUpdateBody = z.input<typeof userUpdateSchema>;


