import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { RoleCreateBody, genericListQuerySchema } from "@/schemas/role";
import { z } from "zod";
import { PaginatedData } from "@/types/base";
import { Role } from "@/types/user";

type RoleGetListQuery = z.infer<typeof genericListQuerySchema>;

export const roleRequest = {
    getList: (params?: RoleGetListQuery) =>
        http.get<PaginatedData<Role>>(ENDPOINT_CLIENT.ROLES, { query: params }),
    create: (body: RoleCreateBody) =>
        http.post<Role>(ENDPOINT_CLIENT.ROLES, body),
    dumb: () =>
        http.post(ENDPOINT_CLIENT.ROLES_DUMB, {}),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.ROLE_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.ROLE_DETAIL(id), {}),
};
