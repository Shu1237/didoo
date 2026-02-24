import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { CategoryCreateBody, CategoryUpdateBody } from "@/schemas/category";
import { PaginatedData } from "@/types/base";
import { Category, CategoryGetListQuery } from "@/types/category";

export const categoryRequest = {
    getList: (params: CategoryGetListQuery) =>
        http.get<PaginatedData<Category>>(ENDPOINT_CLIENT.CATEGORIES, { query: params }),
    getById: (id: string) =>
        http.get<Category>(ENDPOINT_CLIENT.CATEGORY_DETAIL(id)),
    create: (body: CategoryCreateBody) =>
        http.post<Category>(ENDPOINT_CLIENT.CATEGORIES, body),
    update: (id: string, body: CategoryUpdateBody) =>
        http.put<Partial<Category>>(ENDPOINT_CLIENT.CATEGORY_DETAIL(id), body),
    updatePartial: (id: string, body: CategoryUpdateBody) =>
        http.patch<Partial<Category>>(ENDPOINT_CLIENT.CATEGORY_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.CATEGORY_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.CATEGORY_DETAIL(id), {}),
};
