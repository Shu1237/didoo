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



export type TicketCreateBody = z.input<typeof ticketCreateSchema>;
export type TicketUpdateBody = z.input<typeof ticketUpdateSchema>;



