import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { FavoriteCreateBody } from "@/schemas/favorite";
import { PaginatedData } from "@/types/base";
import { Favorite, FavoriteGetListQuery } from "@/types/favorite";

export const favoriteRequest = {
    getList: (params: FavoriteGetListQuery) =>
        http.get<PaginatedData<Favorite>>(ENDPOINT_CLIENT.FAVORITES, { query: params }),
    getById: (id: string) =>
        http.get<Favorite>(ENDPOINT_CLIENT.FAVORITE_DETAIL(id)),
    create: (body: FavoriteCreateBody) =>
        http.post<Favorite>(ENDPOINT_CLIENT.FAVORITES, body),
    delete: (userId: string, eventId: string) =>
        http.delete<null>(ENDPOINT_CLIENT.FAVORITE_DELETE(userId, eventId)),
    softDelete: (userId: string, eventId: string) =>
        http.delete<null>(ENDPOINT_CLIENT.FAVORITE_SOFT_DELETE(userId, eventId)),
    restore: (userId: string, eventId: string) =>
        http.patch<null>(ENDPOINT_CLIENT.FAVORITE_DELETE(userId, eventId), {}),
};
