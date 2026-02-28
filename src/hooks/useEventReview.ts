import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventReviewRequest } from "@/apiRequest/eventReview";
import { EventReviewCreateBody, EventReviewUpdateBody } from "@/schemas/eventReview";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { EventReviewGetListQuery } from "@/types/eventReview";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetEventReviews = (params?: EventReviewGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.eventReviews.list(params),
        queryFn: () => eventReviewRequest.getList(params || {}),
    });
};

export const useGetEventReview = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.eventReviews.detail(id),
        queryFn: () => eventReviewRequest.getById(id),
        enabled: !!id,
    });
};

export const useEventReview = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: EventReviewCreateBody) => {
            const res = await eventReviewRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Tạo đánh giá thành công');
            queryClient.invalidateQueries({ queryKey: KEY.eventReviews });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: EventReviewUpdateBody }) => {
            const res = await eventReviewRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Cập nhật đánh giá thành công');
            queryClient.invalidateQueries({ queryKey: KEY.eventReviews });
        },
    });

    const deleteReview = useMutation({
        mutationFn: async (id: string) => {
            const res = await eventReviewRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.eventReviews });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await eventReviewRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.eventReviews });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteReview, restore };
};

