import { z } from "zod";

export const eventReviewCreateSchema = z.object({
    EventId: z.string().uuid(),
    UserId: z.string().uuid(),
    Rating: z.number().int().min(1).max(5),
    Comment: z.string().min(1),
    ParentReviewId: z.string().uuid().nullable().optional(),
});

export const eventReviewUpdateSchema = z.object({
    Rating: z.number().int().min(1).max(5).optional(),
    Comment: z.string().min(1).optional(),
    IsDeleted: z.boolean().optional(),
});

export type EventReviewCreateBody = z.input<typeof eventReviewCreateSchema>;
export type EventReviewUpdateBody = z.input<typeof eventReviewUpdateSchema>;
