import { BasePaginationQuery } from "./base";

export interface FavoriteGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
}

export interface Favorite {
    id: string;
    userId: string;
    eventId: string;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}
