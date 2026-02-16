import { BasePaginationQuery } from "./base";
import { Event } from "./event";

export interface FavoriteGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
}

export interface Favorite {
    id: string;
    userId: string;
    eventId: string;
    event?: Partial<Event>;
    createdAt: string;
}
