import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventRequest } from "@/apiRequest/event";
import { EventCreateBody, EventUpdateBody } from "@/schemas/event";
import { QUERY_KEY } from "@/utils/constant";
import { EventGetListQuery } from "@/types/event";

export const useGetEvents = (params?: EventGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.eventList(params),
        queryFn: () => eventRequest.getList(params || {}),
    });
};

export const useGetEvent = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.eventDetail(id),
        queryFn: () => eventRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useEvent = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: EventCreateBody) => eventRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: EventUpdateBody }) => eventRequest.update(id, body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventList() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventDetail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteEvent = useMutation({
        mutationFn: (id: string) => eventRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => eventRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.eventList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteEvent, restore };
};

