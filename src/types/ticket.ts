import { BasePaginationQuery } from "./base";
import { Event } from "./event";
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
    status: number; // 1=Available 2=Full 3=Unavailable 4=Locked
    createdAt: string;
}

export interface TicketListingGetListQuery extends BasePaginationQuery {
    sellerUserId?: string;
    ticketId?: string;
    eventId?: string;
    status?: number;
    fromPrice?: number;
    toPrice?: number;
    isDescending?: boolean;
    isDeleted?: boolean;
    fields?: string;
  }
  
  export interface TicketListing {
    id: string;
    ticketId: string;
    sellerUserId: string;
    askingPrice: number;
    description?: string;
    status: number;
    createdAt: string;
    updatedAt?: string;
  }

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
