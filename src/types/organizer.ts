import { BasePaginationQuery } from "./base";
import { Event } from "./event";

export interface OrganizerGetListQuery extends BasePaginationQuery {
    name?: string;
    status?: string;
}

export interface Organizer {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
    email: string;
    phone?: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    address?: string;
    isVerified: boolean;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    events?: Partial<Event>[];
}
