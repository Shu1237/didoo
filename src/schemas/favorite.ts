import { z } from "zod";

/** Match BE FavoriteCreateCommand - camelCase */
export const favoriteCreateSchema = z.object({
    userId: z.string().uuid(),
    eventId: z.string().uuid(),
});

export type FavoriteCreateBody = z.input<typeof favoriteCreateSchema>;
