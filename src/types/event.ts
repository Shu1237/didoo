import { BasePaginationQuery } from "./base";
import { Category } from "./category";
import { Organizer } from "./organizer";

export interface EventGetListQuery extends BasePaginationQuery {
    name?: string;
    slug?: string;
    subtitle?: string;
    description?: string;
    tags?: string; // Comma separated or single tag
    startTime?: string;
    endTime?: string;
    status?: string;
    categoryId?: string;
    organizerId?: string;
    ageRestriction?: number;
}

export interface EventTag {
    name: string;
}

export interface EventLocation {
    id?: string;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
}

export interface Event {
    id: string;
    name: string;
    slug: string;
    subtitle?: string;
    description: string;
    tags?: EventTag[];
    startTime: string;
    endTime: string;
    openTime?: string;
    closedTime?: string;
    status: string;
    thumbnailUrl?: string;
    bannerUrl?: string;
    ageRestriction: number;
    category?: Category;
    organizer?: Organizer;
    locations?: EventLocation[];
}
