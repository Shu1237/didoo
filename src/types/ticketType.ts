import { BasePaginationQuery } from "./base";
import { Event } from "./event";

export interface TicketTypeGetListQuery extends BasePaginationQuery {
    eventId?: string;
    name?: string;
    fromPrice?: number;
    toPrice?: number;
    description?: string;
}

export interface TicketType {
    id: string;
    eventId: string;
    name: string;
    price: number;
    totalQuantity: number;
    availableQuantity: number;
    description?: string;
    event?: Partial<Event>;
    createdAt?: string;
    updatedAt?: string;
}
