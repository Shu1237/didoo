import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryRequest } from "@/apiRequest/category";
import { CategoryCreateBody, CategoryUpdateBody } from "@/schemas/category";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { CategoryGetListQuery } from "@/types/category";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";
import { useSessionStore } from "@/stores/sesionStore";


export const useGetCategories = (params?: CategoryGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.categories.list(params),
        queryFn: () => categoryRequest.getList(params || {}),
    });
};

export const useGetCategory = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.categories.detail(id),
        queryFn: () => categoryRequest.getById(id),
        enabled: !!id,
    });
};

export const useCategory = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: CategoryCreateBody) => {
            const res = await categoryRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Tạo danh mục thành công');
            queryClient.invalidateQueries({ queryKey: KEY.categories });
        },
    });

    const update = useMutation({
        mutationFn: async ({ id, body }: { id: string; body: CategoryUpdateBody }) => {
            const res = await categoryRequest.update(id, body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Cập nhật danh mục thành công');
            queryClient.invalidateQueries({ queryKey: KEY.categories });
        },
    });

    const deleteCategory = useMutation({
        mutationFn: async (id: string) => {
            const res = await categoryRequest.delete(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.categories });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async (id: string) => {
            const res = await categoryRequest.restore(id);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.categories });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, update, deleteCategory, restore };
};

