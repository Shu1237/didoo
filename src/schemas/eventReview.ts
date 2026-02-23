import { z } from "zod";

export const eventReviewCreateSchema = z.object({
    eventId: z.uuid(),
    userId: z.uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1),
    parentReviewId: z.uuid().nullable().optional(),
});

export const eventReviewUpdateSchema = z.object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(1).optional(),
});



export type EventReviewCreateBody = z.input<typeof eventReviewCreateSchema>;
export type EventReviewUpdateBody = z.input<typeof eventReviewUpdateSchema>;



