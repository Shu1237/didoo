import { BasePaginationQuery } from "./base";
import { Event } from "./event";

/** Match BE TicketTypeGetListQuery */
export interface TicketTypeGetListQuery extends BasePaginationQuery {
    eventId?: string;
    name?: string;
    fromPrice?: number;
    toPrice?: number;
    description?: string;
}

/** Match BE TicketTypeDTO - event nested */
export interface TicketType {
    id: string;
    event?: Partial<Event>;
    name: string;
    price: number;
    totalQuantity: number;
    availableQuantity: number;
    description?: string;
    createdAt?: string;
}
