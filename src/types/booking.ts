import { BasePaginationQuery } from "./base";

/** Match BE BookingGetListQuery */
export interface BookingGetListQuery extends BasePaginationQuery {
    userId?: string;
    eventId?: string;
    status?: number;
}

/** Match BE BookingDetail - nested in booking */
export interface BookingDetailItem {
    id: string;
    seatId?: string | null;
    ticketId: string;
    quantity: number;
    pricePerTicket: number;
    totalPrice: number;
}

/** Match BE BookingDTO */
export interface Booking {
    id: string;
    userId: string;
    eventId: string;
    fullname: string;
    email: string;
    phone: string;
    amount: number;
    totalPrice: number;
    status: string; // Pending, Paid, Cancelled, etc.
    paidAt?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
    isDeleted?: boolean;
    deletedAt?: string | null;
    paymentUrl?: string;
    bookingDetails?: BookingDetailItem[];
}
