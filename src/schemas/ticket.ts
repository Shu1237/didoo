import { z } from "zod";
import { TicketStatus } from "@/utils/enum";

export const ticketCreateSchema = z.object({
    ticketTypeId: z.uuid(),
    eventId: z.uuid(),
    zone: z.string().optional(),
    status: z.enum(TicketStatus).default(TicketStatus.READY),
});

export const ticketUpdateSchema = z.object({
    ticketTypeId: z.uuid().optional(),
    zone: z.string().optional(),
    status: z.enum(TicketStatus).optional(),
});



export type TicketCreateBody = z.input<typeof ticketCreateSchema>;
export type TicketUpdateBody = z.input<typeof ticketUpdateSchema>;



