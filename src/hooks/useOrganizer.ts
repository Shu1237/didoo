import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { organizerRequest } from "@/apiRequest/organizer";
import { OrganizerCreateBody, OrganizerUpdateBody } from "@/schemas/organizer";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { OrganizerGetListQuery } from "@/types/organizer";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetOrganizers = (params?: OrganizerGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.organizers.list(params),
        queryFn: () => organizerRequest.getList(params || {}),
    });
};

export const useGetOrganizer = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.organizers.detail(id),
        queryFn: () => organizerRequest.getById(id),
        enabled: !!id,
    });
};

export const useOrganizer = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: OrganizerCreateBody) => {
            const res = await organizerRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Organizer created successfully');
            queryClient.invalidateQueries({ queryKey: KEY.organizers });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: OrganizerUpdateBody }) => {
            const res = await organizerRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Organizer updated successfully');
            queryClient.invalidateQueries({ queryKey: KEY.organizers });
        },
    });

    const deleteOrganizer = useMutation({
        mutationFn: async (id: string) => {
            const res = await organizerRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.organizers });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await organizerRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.organizers });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteOrganizer, restore };
};

