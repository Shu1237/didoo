import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleRequest } from "@/apiRequest/role";
import { RoleCreateBody } from "@/schemas/role";
import { QUERY_KEY } from "@/utils/constant";

export const useGetRoles = () => {
    return useQuery({
        queryKey: QUERY_KEY.roleList,
        queryFn: () => roleRequest.getList(),
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useRole = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: RoleCreateBody) => roleRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.roleList });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const dumb = useMutation({
        mutationFn: () => roleRequest.dumb(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.roleList });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteRole = useMutation({
        mutationFn: (id: string) => roleRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.roleList });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => roleRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.roleList });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, dumb, deleteRole, restore };
};

