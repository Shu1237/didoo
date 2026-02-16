import { z } from "zod";

export const interactionCreateSchema = z.object({
    type: z.number().int().min(0).max(3), // InteractionType
    eventId: z.uuid(),
    userId: z.uuid(),
});




export type InteractionCreateBody = z.input<typeof interactionCreateSchema>;



