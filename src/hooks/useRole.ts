import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleRequest } from "@/apiRequest/role";
import { RoleCreateBody } from "@/schemas/role";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetRoles = () => {
    return useQuery({
        queryKey: QUERY_KEY.roles.list(),
        queryFn: () => roleRequest.getList(),
    });
};

export const useRole = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: RoleCreateBody) => {
            const res = await roleRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Role created successfully');
            queryClient.invalidateQueries({ queryKey: KEY.roles });
        },
    });
    // gen default roles ( k xài fe)
    const dumb = useMutation({
        mutationFn: async () => {
            const res = await roleRequest.dumb();
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.roles });
        },
        onError: (error) => {
            handleErrorApi({ error });
        },
    });

    const deleteRole = useMutation({
        mutationFn: async (id: string) => {
            const res = await roleRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.roles });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await roleRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.roles });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, dumb, deleteRole, restore };
};

