import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizerRequest } from "@/apiRequest/organizer";
import { OrganizerCreateBody, OrganizerUpdateBody } from "@/schemas/organizer";
import { QUERY_KEY } from "@/utils/constant";
import { OrganizerGetListQuery } from "@/types/organizer";

export const useGetOrganizers = (params?: OrganizerGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.organizerList(params),
        queryFn: () => organizerRequest.getList(params || {}),
    });
};

export const useGetOrganizer = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.organizerDetail(id),
        queryFn: () => organizerRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useOrganizer = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: OrganizerCreateBody) => organizerRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.organizerList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: OrganizerUpdateBody }) => organizerRequest.update(id, body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.organizerList() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.organizerDetail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteOrganizer = useMutation({
        mutationFn: (id: string) => organizerRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.organizerList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => organizerRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.organizerList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteOrganizer, restore };
};

