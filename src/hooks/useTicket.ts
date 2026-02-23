import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketRequest } from "@/apiRequest/ticket";
import { TicketCreateBody, TicketUpdateBody } from "@/schemas/ticket";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { TicketGetListQuery } from "@/types/ticket";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetTickets = (params?: TicketGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.tickets.list(params),
        queryFn: () => ticketRequest.getList(params || {}),
    });
};

export const useGetTicket = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.tickets.detail(id),
        queryFn: () => ticketRequest.getById(id),
        enabled: !!id,
    });
};

export const useTicket = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: TicketCreateBody) => {
            const res = await ticketRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Ticket created successfully');
            queryClient.invalidateQueries({ queryKey: KEY.tickets });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: TicketUpdateBody }) => {
            const res = await ticketRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Ticket updated successfully');
            queryClient.invalidateQueries({ queryKey: KEY.tickets });
        },
    });

    const deleteTicket = useMutation({
        mutationFn: async (id: string) => {
            const res = await ticketRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.tickets });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await ticketRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.tickets });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteTicket, restore };
};

