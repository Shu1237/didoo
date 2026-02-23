import { z } from "zod";

export const favoriteCreateSchema = z.object({
    userId: z.uuid(),
    eventId: z.uuid(),
});


export type FavoriteCreateBody = z.input<typeof favoriteCreateSchema>;



