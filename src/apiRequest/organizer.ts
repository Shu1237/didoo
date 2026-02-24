import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { OrganizerCreateBody, OrganizerUpdateBody } from "@/schemas/organizer";
import { PaginatedData } from "@/types/base";
import { Organizer, OrganizerGetListQuery } from "@/types/organizer";

export const organizerRequest = {
    getList: (params: OrganizerGetListQuery) =>
        http.get<PaginatedData<Organizer>>(ENDPOINT_CLIENT.ORGANIZERS, { query: params }),
    getById: (id: string) =>
        http.get<Organizer>(ENDPOINT_CLIENT.ORGANIZER_DETAIL(id)),
    create: (body: OrganizerCreateBody) =>
        http.post<Organizer>(ENDPOINT_CLIENT.ORGANIZERS, body),
    update: (id: string, body: OrganizerUpdateBody) =>
        http.put<Partial<Organizer>>(ENDPOINT_CLIENT.ORGANIZER_DETAIL(id), body),
    updatePartial: (id: string, body: OrganizerUpdateBody) =>
        http.patch<Partial<Organizer>>(ENDPOINT_CLIENT.ORGANIZER_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.ORGANIZER_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.ORGANIZER_DETAIL(id), {}),
};
