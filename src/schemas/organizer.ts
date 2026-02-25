import { z } from "zod";
import { OrganizerStatus } from "@/utils/enum";

export const organizerCreateSchema = z.object({
    Name: z.string().min(1, "Tên tổ chức là bắt buộc"),
    Slug: z.string().min(1, "Slug là bắt buộc"),
    Description: z.string().optional().or(z.literal("")),
    LogoUrl: z.string().url("Link Logo không hợp lệ").optional().or(z.literal("")),
    BannerUrl: z.string().url("Link Banner không hợp lệ").optional().or(z.literal("")),
    Email: z.string().email("Email không hợp lệ"),
    Phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số").regex(/^0\d{9,10}$/, "Số điện thoại không hợp lệ"),
    WebsiteUrl: z.string().url("Link Website không hợp lệ").optional().or(z.literal("")),
    FacebookUrl: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal("")),
    InstagramUrl: z.string().url("Link Instagram không hợp lệ").optional().or(z.literal("")),
    TiktokUrl: z.string().url("Link TikTok không hợp lệ").optional().or(z.literal("")),
    Address: z.string().optional().or(z.literal("")),
});

export const organizerUpdateSchema = z.object({
    id: z.string().optional(),
    Name: z.string().min(1).optional(),
    Slug: z.string().optional(),
    Description: z.string().optional(),
    LogoUrl: z.string().url().optional().or(z.literal("")),
    BannerUrl: z.string().url().optional().or(z.literal("")),
    Email: z.string().email().optional(),
    Phone: z.string().optional().or(z.literal("")),
    WebsiteUrl: z.string().url().optional().or(z.literal("")),
    FacebookUrl: z.string().url().optional().or(z.literal("")),
    InstagramUrl: z.string().url().optional().or(z.literal("")),
    TiktokUrl: z.string().url().optional().or(z.literal("")),
    Status: z.nativeEnum(OrganizerStatus).optional(),
    IsVerified: z.boolean().optional(),
});



export type OrganizerCreateBody = z.input<typeof organizerCreateSchema>;
export type OrganizerUpdateBody = z.input<typeof organizerUpdateSchema>;


