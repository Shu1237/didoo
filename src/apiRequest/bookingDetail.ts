import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { PaginatedData } from "@/types/base";
import { BookingDetail, BookingDetailGetListQuery } from "@/types/bookingDetail";

export const bookingDetailRequest = {
    getList: (params: BookingDetailGetListQuery) =>
        http.get<PaginatedData<BookingDetail>>(ENDPOINT_CLIENT.BOOKING_DETAILS, { query: params }),
    getById: (id: string) =>
        http.get<BookingDetail>(ENDPOINT_CLIENT.BOOKING_DETAIL_ITEM(id)),
};
