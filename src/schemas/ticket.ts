import { z } from "zod";
import { TicketStatus } from "@/utils/enum";

export const ticketCreateSchema = z.object({
    ticketTypeId: z.string().uuid(),
    eventId: z.string().uuid(),
    zone: z.string().optional(),
    status: z.nativeEnum(TicketStatus).default(TicketStatus.AVAILABLE),
});

export const ticketUpdateSchema = z.object({
    ticketTypeId: z.string().uuid().optional(),
    zone: z.string().optional(),
    status: z.nativeEnum(TicketStatus).optional(),
});



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

const ticketTypeArrayItemSchema = z.object({
    eventId: z.string().uuid(),
    name: z.string().min(1),
    price: z.number().min(0),
    totalQuantity: z.number().int().min(0),
    availableQuantity: z.number().int().min(0),
    description: z.string().optional(),
});

export const ticketTypeCreateArraySchema = z.object({
    ticketTypes: z.array(ticketTypeArrayItemSchema).min(1, "Thêm ít nhất một loại vé"),
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
export type TicketTypeCreateArrayBody = z.input<typeof ticketTypeCreateArraySchema>;





export type TicketCreateBody = z.input<typeof ticketCreateSchema>;
export type TicketUpdateBody = z.input<typeof ticketUpdateSchema>;


export const ticketListingCreateSchema = z.object({
    ticketId: z.array(z.string().uuid()).min(1, "Vui lòng chọn ít nhất 1 vé"),
    sellerUserId: z.string().uuid(),
    askingPrice: z.number().min(0),
    description: z.string().optional(),
  });
  
  export const ticketListingCancelSchema = z.object({
    SellerUserId: z.string().uuid(),
  });
  
  export const ticketListingMarkSoldSchema = z.object({
    NewOwnerUserId: z.string().uuid(),
  });
  
  export type TicketListingCreateBody = z.input<typeof ticketListingCreateSchema>;
  export type TicketListingCancelBody = z.input<typeof ticketListingCancelSchema>;
  export type TicketListingMarkSoldBody = z.input<typeof ticketListingMarkSoldSchema>;
  



