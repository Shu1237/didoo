import { z } from "zod";

export const favoriteCreateSchema = z.object({
    UserId: z.string().uuid(),
    EventId: z.string().uuid(),
});

export type FavoriteCreateBody = z.input<typeof favoriteCreateSchema>;
