import { InteractionType } from "@/utils/enum";
import { BasePaginationQuery } from "./base";

export interface InteractionGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
    type?: InteractionType;
}

export interface Interaction {
    id: string;
    userId: string;
    eventId: string;
    type: InteractionType;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}
