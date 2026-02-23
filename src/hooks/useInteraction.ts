import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionRequest } from "@/apiRequest/interaction";
import { InteractionCreateBody } from "@/schemas/interaction";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { InteractionGetListQuery } from "@/types/interaction";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetInteractions = (params?: InteractionGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.interactions.list(params),
        queryFn: () => interactionRequest.getList(params || {}),
    });
};

export const useGetInteraction = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.interactions.detail(id),
        queryFn: () => interactionRequest.getById(id),
        enabled: !!id,
    });
};

export const useInteraction = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: InteractionCreateBody) => {
            const res = await interactionRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Interaction created successfully');
            queryClient.invalidateQueries({ queryKey: KEY.interactions });
        },
    });

    const remove = useMutation({
        mutationFn: async ({ userId, eventId, type }: { userId: string; eventId: string; type: number }) => {
            const res = await interactionRequest.delete(userId, eventId, type);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.interactions });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const softRemove = useMutation({
        mutationFn: async ({ userId, eventId, type }: { userId: string; eventId: string; type: number }) => {
            const res = await interactionRequest.softDelete(userId, eventId, type);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.interactions });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async ({ userId, eventId, type }: { userId: string; eventId: string; type: number }) => {
            const res = await interactionRequest.restore(userId, eventId, type);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.interactions });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, remove, softRemove, restore };
};
