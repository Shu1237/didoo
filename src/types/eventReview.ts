import { BasePaginationQuery } from "./base";

export interface EventReviewGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
    rating?: number;
}

export interface EventReview {
    id: string;
    userId: string;
    eventId: string;
    rating: number;
    comment: string;
    parentReviewId?: string | null;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}
