import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventReviewRequest } from "@/apiRequest/eventReview";
import { EventReviewCreateBody, EventReviewUpdateBody } from "@/schemas/eventReview";
import { QUERY_KEY } from "@/utils/constant";
import { EventReviewGetListQuery } from "@/types/eventReview";

export const useGetEventReviews = (params?: EventReviewGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.eventReviewList(params),
        queryFn: () => eventReviewRequest.getList(params || {}),
    });
};

export const useGetEventReview = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.eventReviewDetail(id),
        queryFn: () => eventReviewRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useEventReview = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: EventReviewCreateBody) => eventReviewRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventReviewList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: EventReviewUpdateBody }) => eventReviewRequest.update(id, body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventReviewList() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventReviewDetail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteReview = useMutation({
        mutationFn: (id: string) => eventReviewRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventReviewList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => eventReviewRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventReviewList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteReview, restore };
};

