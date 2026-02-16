import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryRequest } from "@/apiRequest/category";
import { CategoryCreateBody, CategoryUpdateBody } from "@/schemas/category";
import { QUERY_KEY } from "@/utils/constant";
import { CategoryGetListQuery } from "@/types/category";

export const useGetCategories = (params?: CategoryGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.categoryList(params),
        queryFn: () => categoryRequest.getList(params || {}),
    });
};

export const useGetCategory = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.categoryDetail(id),
        queryFn: () => categoryRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useCategory = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: CategoryCreateBody) => categoryRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.categoryList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const update = useMutation({
        mutationFn: ({ id, body }: { id: string; body: CategoryUpdateBody }) => categoryRequest.update(id, body),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.categoryList() });
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.categoryDetail(variables.id) });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const deleteCategory = useMutation({
        mutationFn: (id: string) => categoryRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.categoryList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: (id: string) => categoryRequest.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.categoryList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteCategory, restore };
};

