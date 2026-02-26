import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { BookingCreateBody } from "@/schemas/booking";
import { PaginatedData } from "@/types/base";
import { Booking, BookingGetListQuery } from "@/types/booking";

/** BE có thể trả totalCount/totalPage - dùng PaginatedData tương thích */
export const bookingRequest = {
    getList: (params: BookingGetListQuery) =>
        http.get<PaginatedData<Booking>>(ENDPOINT_CLIENT.BOOKINGS, { query: params }),
    getById: (id: string) =>
        http.get<Booking>(ENDPOINT_CLIENT.BOOKING_DETAIL(id)),
    create: (body: BookingCreateBody) =>
        http.post<Booking>(ENDPOINT_CLIENT.BOOKINGS, body),
};
