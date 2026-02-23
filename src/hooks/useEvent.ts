import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventRequest } from "@/apiRequest/event";
import { EventCreateBody, EventUpdateBody } from "@/schemas/event";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { EventGetListQuery } from "@/types/event";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetEvents = (params?: EventGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.events.list(params),
        queryFn: () => eventRequest.getList(params || {}),
    });
};

export const useGetEvent = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.events.detail(id),
        queryFn: () => eventRequest.getById(id),
        enabled: !!id,
    });
};

export const useEvent = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: EventCreateBody) => {
            const res = await eventRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Event created successfully');
            queryClient.invalidateQueries({ queryKey: KEY.events });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: EventUpdateBody }) => {
            const res = await eventRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Event updated successfully');
            queryClient.invalidateQueries({ queryKey: KEY.events });
        },
    });

    const deleteEvent = useMutation({
        mutationFn: async (id: string) => {
            const res = await eventRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.events });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await eventRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.events });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteEvent, restore };
};

