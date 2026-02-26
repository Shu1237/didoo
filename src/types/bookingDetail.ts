import { BasePaginationQuery } from "./base";

/** Match BE BookingDetailGetListQuery */
export interface BookingDetailGetListQuery extends BasePaginationQuery {
    bookingId?: string;
    ticketId?: string;
    seatId?: string;
}

/** Match BE BookingDetailDTO */
export interface BookingDetail {
    id: string;
    bookingId: string;
    seatId?: string | null;
    ticketId: string;
    quantity: number;
    pricePerTicket: number;
    totalPrice: number;
    createdAt?: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
    deletedAt?: string | null;
}
