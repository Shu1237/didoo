import { EventStatus } from "@/utils/enum";
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
    status?: EventStatus;
    categoryId?: string;
    organizerId?: string;
    ageRestriction?: number;
}

export interface EventTag {
    tagName: string;
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
    status: EventStatus;
    thumbnailUrl?: string;
    bannerUrl?: string;
    ageRestriction: number;
    sold?: number;
    total?: number;
    category?: Category;
    organizer?: Organizer;
    locations?: EventLocation[];
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}
