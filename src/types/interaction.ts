import { InteractionType } from "@/utils/enum";
import { BasePaginationQuery } from "./base";

/** Match BE InteractionGetListQuery */
export interface InteractionGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
    type?: InteractionType;
}

/** Match BE InteractionDTO - user, event nested */
export interface InteractionUser {
    id: string;
    fullName?: string;
    avatarUrl?: string;
    gender?: number;
}

export interface InteractionEvent {
    id: string;
    name?: string;
    slug?: string;
    subtitle?: string;
    description?: string;
}

export interface Interaction {
    id: string;
    type: InteractionType;
    user: InteractionUser;
    event: InteractionEvent;
}
