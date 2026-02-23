import { BasePaginationQuery } from "./base";
import { User } from "./user";

export interface EventReviewGetListQuery extends BasePaginationQuery {
    eventId?: string;
    userId?: string;
    minRating?: number;
    maxRating?: number;
}

export interface EventReview {
    id: string;
    eventId: string;
    userId: string;
    rating: number;
    comment: string;
    parentReviewId?: string | null;
    createdAt?: string;
    user?: Partial<User>;
}
