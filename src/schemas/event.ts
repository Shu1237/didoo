import { z } from "zod";
import { EventStatus } from "@/utils/enum";

export const tagSchema = z.object({
    Name: z.string().min(1, "Tên tag là bắt buộc"),
});

export const locationSchema = z.object({
    Name: z.string().min(1, "Tên địa điểm là bắt buộc"),
    Address: z.string().min(1, "Địa chỉ là bắt buộc"),
    Latitude: z.number().optional(),
    Longitude: z.number().optional(),
});

export const eventCreateSchema = z.object({
    Name: z.string().min(1, "Tên sự kiện là bắt buộc"),
    Slug: z.string().min(1, "Slug là bắt buộc"),
    Subtitle: z.string().optional().or(z.literal("")),
    Description: z.string().min(1, "Mô tả là bắt buộc"),
    Tags: z.array(tagSchema).optional(),
    StartTime: z.coerce.date({ message: "Thời gian bắt đầu không hợp lệ" }),
    EndTime: z.coerce.date({ message: "Thời gian kết thúc không hợp lệ" }),
    OpenTime: z.string().optional().or(z.literal("")), // format "HH:mm"
    ClosedTime: z.string().optional().or(z.literal("")),
    ThumbnailUrl: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal("")),
    BannerUrl: z.string().url("Link banner không hợp lệ").optional().or(z.literal("")),
    AgeRestriction: z.number().int().min(0).default(0),
    CategoryId: z.string().min(1, "Danh mục là bắt buộc"),
    OrganizerId: z.string().min(1, "OrganizerId là bắt buộc"),
    Locations: z.array(locationSchema).min(1, "Phải có ít nhất một địa điểm"),
});

export const eventUpdateSchema = z.object({
    Name: z.string().min(1).optional(),
    Slug: z.string().optional(),
    Subtitle: z.string().optional().or(z.literal("")),
    Description: z.string().optional(),
    Tags: z.array(tagSchema).optional(),
    StartTime: z.coerce.date().optional(),
    EndTime: z.coerce.date().optional(),
    OpenTime: z.string().optional().or(z.literal("")),
    ClosedTime: z.string().optional().or(z.literal("")),
    Status: z.nativeEnum(EventStatus).optional(),
    ThumbnailUrl: z.string().url().optional().or(z.literal("")),
    BannerUrl: z.string().url().optional().or(z.literal("")),
    AgeRestriction: z.number().int().optional(),
    CategoryId: z.string().optional(),
    OrganizerId: z.string().optional(),
    Locations: z.array(locationSchema).optional(),
    IsDeleted: z.boolean().optional(),
});

export type EventCreateBody = z.input<typeof eventCreateSchema>;
export type EventUpdateBody = z.input<typeof eventUpdateSchema>;


