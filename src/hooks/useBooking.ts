import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingRequest } from "@/apiRequest/booking";
import { bookingDetailRequest } from "@/apiRequest/bookingDetail";
import { BookingCreateBody } from "@/schemas/booking";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { BookingGetListQuery } from "@/types/booking";
import { BookingDetailGetListQuery } from "@/types/bookingDetail";
import { handleErrorApi } from "@/lib/errors";

export const useGetBookings = (params?: BookingGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.bookings.list(params),
        queryFn: () => bookingRequest.getList(params || {}),
    });
};

export const useGetBooking = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.bookings.detail(id),
        queryFn: () => bookingRequest.getById(id),
        enabled: !!id,
    });
};

export const useGetBookingDetails = (params?: BookingDetailGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.bookingDetails.list(params),
        queryFn: () => bookingDetailRequest.getList(params || {}),
    });
};

export const useGetBookingDetail = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.bookingDetails.detail(id),
        queryFn: () => bookingDetailRequest.getById(id),
        enabled: !!id,
    });
};

export const useBooking = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: BookingCreateBody) => {
            const res = await bookingRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.bookings });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    return { create };
};
