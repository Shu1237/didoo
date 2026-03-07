import { z } from "zod";

const ticketTypeRowSchema = z.object({
    name: z.string().min(1, "Tên loại vé là bắt buộc"),
    price: z.number().min(0, "Giá phải >= 0"),
    totalQuantity: z.number().int().min(0, "Số lượng phải >= 0"),
    description: z.string().optional(),
});

export const ticketTypeCreateSchema = z.object({
    eventId: z.uuid(),
    name: z.string().min(1),
    price: z.number().min(0),
    totalQuantity: z.number().int().min(0),
    availableQuantity: z.number().int().min(0),
    description: z.string().optional(),
});

/** Schema cho form thêm nhiều loại vé (BE chỉ tạo 1/lần → FE gửi tuần tự) */
export const ticketTypesBatchSchema = z.object({
    items: z.array(ticketTypeRowSchema).min(1, "Thêm ít nhất một loại vé"),
});

export const ticketTypeUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    totalQuantity: z.number().int().min(0).optional(),
    availableQuantity: z.number().int().min(0).optional(),
    description: z.string().optional(),
});



export type TicketTypeCreateBody = z.input<typeof ticketTypeCreateSchema>;
export type TicketTypeUpdateBody = z.input<typeof ticketTypeUpdateSchema>;
export type TicketTypesBatchBody = z.input<typeof ticketTypesBatchSchema>;



