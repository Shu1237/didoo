import { z } from "zod";

/** Match BE InteractionCreateCommand - type 1=View 2=Heart 3=Save */
export const interactionCreateSchema = z.object({
    type: z.number().int().min(1).max(3),
    eventId: z.string().uuid(),
    userId: z.string().uuid(),
});

export type InteractionCreateBody = z.input<typeof interactionCreateSchema>;
