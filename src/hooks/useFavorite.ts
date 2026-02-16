import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteRequest } from "@/apiRequest/favorite";
import { FavoriteCreateBody } from "@/schemas/favorite";
import { QUERY_KEY } from "@/utils/constant";
import { FavoriteGetListQuery } from "@/types/favorite";

export const useGetFavorites = (params?: FavoriteGetListQuery) => {
    return useQuery({
        queryKey: QUERY_KEY.favoriteList(params),
        queryFn: () => favoriteRequest.getList(params || {}),
    });
};

export const useGetFavorite = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEY.favoriteDetail(id),
        queryFn: () => favoriteRequest.getById(id),
        enabled: !!id,
    });
};

import { handleErrorApi } from "@/lib/errors";

export const useFavorite = () => {
    const queryClient = useQueryClient();

    const create = useMutation({
        mutationFn: (body: FavoriteCreateBody) => favoriteRequest.create(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.favoriteList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const remove = useMutation({
        mutationFn: ({ userId, eventId }: { userId: string; eventId: string }) => favoriteRequest.delete(userId, eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.favoriteList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const softRemove = useMutation({
        mutationFn: ({ userId, eventId }: { userId: string; eventId: string }) => favoriteRequest.softDelete(userId, eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.favoriteList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    const restore = useMutation({
        mutationFn: ({ userId, eventId }: { userId: string; eventId: string }) => favoriteRequest.restore(userId, eventId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.favoriteList() });
        },
        onError: (error) => {
            handleErrorApi({ error });
        }
    });

    return { create, remove, softRemove, restore };
};

