import { EventStatus } from "@/utils/enum";
import { BasePaginationQuery } from "./base";
import { Category } from "./category";
import { Organizer } from "./organizer";

/** Match BE EventGetListQuery */
export interface EventGetListQuery extends BasePaginationQuery {
    name?: string;
    slug?: string;
    subtitle?: string;
    description?: string;
    tags?: string;
    startTime?: string;
    endTime?: string;
    openTime?: string;
    closedTime?: string;
    status?: EventStatus;
    categoryId?: string;
    organizerId?: string;
    ageRestriction?: number;
    hasCategory?: boolean;
    hasOrganizer?: boolean;
    hasLocations?: boolean;
}

export interface EventTag {
    tagName: string;
}

/** Match BE EventEventLocationDTO */
export interface EventLocation {
    id?: string;
    name: string;
    address: string;
    province?: string;
    latitude?: number;
    longitude?: number;
}

/** Match BE EventDTO */
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
    category?: Category;
    organizerId?: string;
    organizer?: Organizer;
    locations?: EventLocation[];
    /** BE chưa có - dùng khi có từ ticket/booking */
    sold?: number;
    total?: number;
    isDeleted?: boolean;
}
