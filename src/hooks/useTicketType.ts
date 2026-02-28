import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ticketTypeRequest } from "@/apiRequest/ticketType";
import { TicketTypeCreateBody, TicketTypeUpdateBody } from "@/schemas/ticketType";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { TicketTypeGetListQuery } from "@/types/ticketType";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetTicketTypes = (params?: TicketTypeGetListQuery, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: QUERY_KEY.ticketTypes.list(params),
        queryFn: () => ticketTypeRequest.getList(params || {}),
        enabled: options?.enabled ?? true,
    });
};

export const useGetTicketType = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.ticketTypes.detail(id),
        queryFn: () => ticketTypeRequest.getById(id),
        enabled: !!id,
    });
};

export const useTicketType = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: TicketTypeCreateBody) => {
            const res = await ticketTypeRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY.ticketTypes });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: TicketTypeUpdateBody }) => {
            const res = await ticketTypeRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Cập nhật loại vé thành công');
            queryClient.invalidateQueries({ queryKey: KEY.ticketTypes });
        },
    });

    const deleteTicketType = useMutation({
        mutationFn: async (id: string) => {
            const res = await ticketTypeRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.ticketTypes });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await ticketTypeRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.ticketTypes });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteTicketType, restore };
};

