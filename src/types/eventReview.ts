import { BasePaginationQuery } from "./base";

/** Match BE EventReviewGetListQuery */
export interface EventReviewGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
    rating?: number;
}

/** Match BE EventReviewDTO - user, event nested */
export interface EventReviewUser {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    gender?: number;
}

export interface EventReviewEvent {
    id: string;
    name?: string;
    slug?: string;
    subtitle?: string;
    description?: string;
}

export interface EventReview {
    id: string;
    user: EventReviewUser;
    event: EventReviewEvent;
    rating: number;
    comment: string;
    reasonDeleted?: string;
    parentReview?: EventReview | null;
    replies?: EventReview[];
}
