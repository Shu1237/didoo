import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketTypeRequest } from "@/apiRequest/ticketType";
import { TicketTypeCreateBody, TicketTypeUpdateBody } from "@/schemas/ticketType";
import { QUERY_KEY } from "@/utils/constant";
import { TicketTypeGetListQuery } from "@/types/ticketType";

export const useGetTicketTypes = (params?: TicketTypeGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.ticketTypeList(params),
        queryFn: () => ticketTypeRequest.getList(params || {}),
    });
};

export const useGetTicketType = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.ticketTypeDetail(id),
        queryFn: () => ticketTypeRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useTicketType = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: TicketTypeCreateBody) => ticketTypeRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketTypeList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: TicketTypeUpdateBody }) => ticketTypeRequest.update(id, body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketTypeList() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketTypeDetail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteTicketType = useMutation({
        mutationFn: (id: string) => ticketTypeRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketTypeList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => ticketTypeRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketTypeList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteTicketType, restore };
};

