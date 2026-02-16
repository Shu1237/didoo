import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketRequest } from "@/apiRequest/ticket";
import { TicketCreateBody, TicketUpdateBody } from "@/schemas/ticket";
import { QUERY_KEY } from "@/utils/constant";
import { TicketGetListQuery } from "@/types/ticket";

export const useGetTickets = (params?: TicketGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.ticketList(params),
        queryFn: () => ticketRequest.getList(params || {}),
    });
};

export const useGetTicket = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.ticketDetail(id),
        queryFn: () => ticketRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useTicket = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: TicketCreateBody) => ticketRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: TicketUpdateBody }) => ticketRequest.update(id, body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketList() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketDetail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteTicket = useMutation({
        mutationFn: (id: string) => ticketRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => ticketRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.ticketList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteTicket, restore };
};

