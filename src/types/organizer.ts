import { OrganizerStatus } from "@/utils/enum";
import { BasePaginationQuery } from "./base";
import { Event } from "./event";

/** Match BE OrganizerGetListQuery */
export interface OrganizerGetListQuery extends BasePaginationQuery {
    name?: string;
    slug?: string;
    status?: OrganizerStatus;
}

/** Match BE OrganizerDTO */
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
    status: OrganizerStatus;
    createdAt?: string;
    updatedAt?: string;
    events?: Partial<Event>[];
}
