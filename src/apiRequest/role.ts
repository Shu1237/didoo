import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { RoleCreateBody } from "@/schemas/role";
import { Role } from "@/types/user";

/** api.md: RoleGetAllResponse returns data as Role[] (not paginated) */
export const roleRequest = {
    getList: () =>
        http.get<Role[]>(ENDPOINT_CLIENT.ROLES),
    create: (body: RoleCreateBody) =>
        http.post<Role>(ENDPOINT_CLIENT.ROLES, body),
    dumb: () =>
        http.post(ENDPOINT_CLIENT.ROLES_DUMB, {}),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.ROLE_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.ROLE_DETAIL(id), {}),
};
