import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userRequest } from "@/apiRequest/user";
import { UserCreateBody, UserUpdateBody } from "@/schemas/user";
import { QUERY_KEY } from "@/utils/constant";
import { UserGetListQuery } from "@/types/user";

export const useGetUsers = (params?: UserGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.userList(params),
        queryFn: () => userRequest.getList(params || {}),
    });
};

export const useGetUser = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.userDetail(id),
        queryFn: () => userRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useUser = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: UserCreateBody) => userRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.userList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: UserUpdateBody }) => userRequest.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.userList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteUser = useMutation({
        mutationFn: (id: string) => userRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.userList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => userRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.userList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteUser, restore };
};

