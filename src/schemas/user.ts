import { z } from "zod";
import { Role } from "@/utils/enum";

// Shared schemas
export const locationSchema = z.object({
    name: z.string().optional(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});

// User schemas
export const userCreateSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.email(),
    phone: z.string().optional(), // regex validation?
    password: z.string().min(6),
    avatarUrl: z.url().optional(),
    gender: z.number().int().min(0).max(2).default(0),
    dateOfBirth: z.date(),
    address: z.string().optional(),
    status: z.string().default("Active"), // Enum?
    roleName: z.string().default(Role.USER),
    organizerId: z.uuid().nullable().optional(),
});

export const userUpdateSchema = z.object({
    fullName: z.string().min(1).optional(),
    phone: z.string().optional(),
    avatarUrl: z.url().optional(),
    gender: z.number().int().min(0).max(2).optional(),
    dateOfBirth: z.date().optional(),
    address: z.string().optional(),
    status: z.string().optional(),
    roleName: z.string().optional(),
    organizerId: z.uuid().nullable().optional(),
});


export type UserCreateBody = z.input<typeof userCreateSchema>;
export type UserUpdateBody = z.input<typeof userUpdateSchema>;


