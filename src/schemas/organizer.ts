import { z } from "zod";
import { OrganizerStatus } from "@/utils/enum";

export const organizerCreateSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
    logoUrl: z.url().optional(),
    bannerUrl: z.url().optional(),
    email: z.email(),
    phone: z.string().optional(),
    websiteUrl: z.url().optional(),
    facebookUrl: z.url().optional(),
    instagramUrl: z.url().optional(),
    tiktokUrl: z.url().optional(),
    address: z.string().optional(),
    isVerified: z.boolean().default(false),
    status: z.enum(OrganizerStatus).default(OrganizerStatus.PENDING),
});

export const organizerUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    logoUrl: z.url().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    websiteUrl: z.url().optional(),
    status: z.enum(OrganizerStatus).optional(),
});



export type OrganizerCreateBody = z.input<typeof organizerCreateSchema>;
export type OrganizerUpdateBody = z.input<typeof organizerUpdateSchema>;


