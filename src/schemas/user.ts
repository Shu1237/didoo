import { z } from "zod";
import { Roles } from "@/utils/enum";

// Shared schemas
export const locationSchema = z.object({
    name: z.string().optional(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});

// User schemas
export const userCreateSchema = z.object({
    FullName: z.string().min(1, "Full name is required"),
    Email: z.string().email(),
    Phone: z.string().optional(),
    Password: z.string().min(6),
    AvatarUrl: z.string().url().optional(),
    Gender: z.number().int().min(0).max(2).default(0),
    DateOfBirth: z.coerce.date(),
    Address: z.string().optional(),
    Status: z.string().default("Active"),
    RoleName: z.string().default(Roles.USER),
    OrganizerId: z.string().uuid().nullable().optional(),
});

export const userUpdateSchema = z.object({
    FullName: z.string().min(1).optional(),
    Phone: z.string().optional(),
    AvatarUrl: z.string().url().optional(),
    Gender: z.number().int().min(0).max(2).optional(),
    DateOfBirth: z.coerce.date().optional(),
    Address: z.string().optional(),
    Status: z.string().optional(),
    RoleName: z.string().optional(),
    OrganizerId: z.string().uuid().nullable().optional(),
    IsVerified: z.boolean().optional(),
    IsDeleted: z.boolean().optional(),
});


export type UserCreateBody = z.input<typeof userCreateSchema>;
export type UserUpdateBody = z.input<typeof userUpdateSchema>;


