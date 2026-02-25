import { BasePaginationQuery } from "./base";

/** Match BE FavoriteGetListQuery */
export interface FavoriteGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
}

/** Match BE FavoriteDTO - user, event nested */
export interface FavoriteUser {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    gender?: number;
}

export interface FavoriteEvent {
    id: string;
    name?: string;
    slug?: string;
    subtitle?: string;
    description?: string;
}

export interface Favorite {
    id: string;
    user: FavoriteUser;
    event: FavoriteEvent;
}
