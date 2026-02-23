import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/apiRequest/user";
import { UserCreateBody, UserUpdateBody } from "@/schemas/user";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { UserGetListQuery } from "@/types/user";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";
import { useSessionStore } from "@/stores/sesionStore";

export const useGetUsers = (params?: UserGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.users.list(params),
        queryFn: () => userRequest.getList(params || {}),
    });
};

export const useGetUser = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.users.detail(id),
        queryFn: () => userRequest.getById(id),
        enabled: !!id,
    });
};

export const useGetMe = () => {
    const user = useSessionStore((state) => state.user);
    const userId = user?.UserId;

    return useQuery({
        queryKey: QUERY_KEY.users.detail(userId || ""),
        queryFn: () => userRequest.getById(userId || ""),
        enabled: !!userId,
    });
};

export const useUser = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: UserCreateBody) => {
            const res = await userRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('User created successfully');
            queryClient.invalidateQueries({ queryKey: KEY.users });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: UserUpdateBody }) => {
            const res = await userRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('User updated successfully');
            queryClient.invalidateQueries({ queryKey: KEY.users });
        },
    });

    const deleteUser = useMutation({
        mutationFn: async (id: string) => {
            const res = await userRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.users });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await userRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.users });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteUser, restore };
};

