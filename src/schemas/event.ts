import { z } from "zod";
import { EventStatus } from "@/utils/enum";

export const tagSchema = z.object({
    name: z.string().min(1),
});

export const locationSchema = z.object({
    name: z.string(),
    address: z.string(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export const eventCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1),
    subtitle: z.string().optional(),
    description: z.string().min(1),
    tags: z.array(tagSchema).optional(),
    startTime: z.date(),
    endTime: z.date(),
    openTime: z.string().optional(), // format "HH:mm"
    closedTime: z.string().optional(),
    thumbnailUrl: z.url().optional(),
    bannerUrl: z.url().optional(),
    ageRestriction: z.number().int().min(0).default(0),
    categoryId: z.uuid(),
    organizerId: z.uuid(),
    locations: z.array(locationSchema).min(1),
});

export const eventUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(tagSchema).optional(),
    startTime: z.date().optional(),
    endTime: z.date().optional(),
    openTime: z.string().optional(),
    closedTime: z.string().optional(),
    status: z.enum(EventStatus).optional(),
    thumbnailUrl: z.url().optional(),
    bannerUrl: z.url().optional(),
    ageRestriction: z.number().int().optional(),
    categoryId: z.uuid().optional(),
    organizerId: z.uuid().optional(),
    locations: z.array(locationSchema).optional(),
});

export type EventCreateBody = z.input<typeof eventCreateSchema>;
export type EventUpdateBody = z.input<typeof eventUpdateSchema>;


