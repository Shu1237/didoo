import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteRequest } from "@/apiRequest/favorite";
import { FavoriteCreateBody } from "@/schemas/favorite";
import { KEY, QUERY_KEY } from "@/utils/constant";
import { FavoriteGetListQuery } from "@/types/favorite";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export const useGetFavorites = (params?: FavoriteGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.favorites.list(params),
        queryFn: () => favoriteRequest.getList(params || {}),
    });
};

export const useGetFavorite = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.favorites.detail(id),
        queryFn: () => favoriteRequest.getById(id),
        enabled: !!id,
    });
};

export const useFavorite = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: async (body: FavoriteCreateBody) => {
            const res = await favoriteRequest.create(body);
            return res.data;
        },
        onSuccess: () => {
            toast.success('Đã thêm vào yêu thích');
            queryClient.invalidateQueries({ queryKey: KEY.favorites });
        },
    });

    const remove = useMutation({
        mutationFn: async ({ userId, eventId }: { userId: string; eventId: string }) => {
            const res = await favoriteRequest.delete(userId, eventId);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.favorites });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const softRemove = useMutation({
        mutationFn: async ({ userId, eventId }: { userId: string; eventId: string }) => {
            const res = await favoriteRequest.softDelete(userId, eventId);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.favorites });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: async ({ userId, eventId }: { userId: string; eventId: string }) => {
            const res = await favoriteRequest.restore(userId, eventId);
            return res.message;
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({ queryKey: KEY.favorites });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, remove, softRemove, restore };
};

