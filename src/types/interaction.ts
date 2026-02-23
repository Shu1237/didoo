import { BasePaginationQuery } from "./base";
import { Event } from "./event";
import { User } from "./user";

export interface InteractionGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
    type?: number;
}

export interface Interaction {
    id: string;
    type: string | number; // API returns string (e.g., "Like") based on examples, but request takes number.
    userId: string;
    eventId: string;
    user?: Partial<User>;
    event?: Partial<Event>;
    createdAt: string;
}
