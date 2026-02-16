import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionRequest } from "@/apiRequest/interaction";
import { InteractionCreateBody } from "@/schemas/interaction";
import { QUERY_KEY } from "@/utils/constant";
import { InteractionGetListQuery } from "@/types/interaction";

export const useGetInteractions = (params?: InteractionGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.interactionList(params),
        queryFn: () => interactionRequest.getList(params || {}),
    });
};

export const useGetInteraction = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.interactionDetail(id),
        queryFn: () => interactionRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useInteraction = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: InteractionCreateBody) => interactionRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.interactionList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const remove = useMutation({
        mutationFn: ({ userId, eventId, type }: { userId: string; eventId: string; type: number }) => interactionRequest.delete(userId, eventId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.interactionList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const softRemove = useMutation({
        mutationFn: ({ userId, eventId, type }: { userId: string; eventId: string; type: number }) => interactionRequest.softDelete(userId, eventId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.interactionList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: ({ userId, eventId, type }: { userId: string; eventId: string; type: number }) => interactionRequest.restore(userId, eventId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.interactionList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, remove, softRemove, restore };
};
