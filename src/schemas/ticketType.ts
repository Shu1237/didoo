import { z } from "zod";

export const ticketTypeCreateSchema = z.object({
    eventId: z.uuid(),
    name: z.string().min(1),
    price: z.number().min(0),
    totalQuantity: z.number().int().min(0),
    availableQuantity: z.number().int().min(0),
    description: z.string().optional(),
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



