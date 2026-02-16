import { BasePaginationQuery } from "./base";
import { Event } from "./event";
import { TicketType } from "./ticketType";

export interface TicketGetListQuery extends BasePaginationQuery {
    ticketTypeId?: string;
    eventId?: string;
    zone?: string;
    status?: number;
    hasEvent?: boolean;
    hasType?: boolean;
}

export interface Ticket {
    id: string;
    ticketType?: Partial<TicketType>;
    event?: Partial<Event>;
    zone?: string;
    status: string; // "Ready", "Sold", etc.
    createdAt: string;
}
