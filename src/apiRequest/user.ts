import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { UserCreateBody, UserUpdateBody } from "@/schemas/user";
import { BasePaginationResponse, PaginatedData } from "@/types/base";
import { User, UserGetListQuery } from "@/types/user";

export const userRequest = {
    getList: (params: UserGetListQuery) =>
        http.get<PaginatedData<User>>(ENDPOINT_CLIENT.USERS, { query: params }),
    getById: (id: string) =>
        http.get<User>(ENDPOINT_CLIENT.USER_DETAIL(id)),
    create: (body: UserCreateBody) =>
        http.post<User>(ENDPOINT_CLIENT.USERS, body),
    update: (id: string, body: UserUpdateBody) =>
        http.put<Partial<User>>(ENDPOINT_CLIENT.USER_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.USER_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.USER_DETAIL(id), {}),
};
