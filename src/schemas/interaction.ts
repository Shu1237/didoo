import { z } from "zod";

export const interactionCreateSchema = z.object({
    Type: z.number().int().min(0).max(3), // InteractionType
    EventId: z.string().uuid(),
    UserId: z.string().uuid(),
});

export type InteractionCreateBody = z.input<typeof interactionCreateSchema>;
