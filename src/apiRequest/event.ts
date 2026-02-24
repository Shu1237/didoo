import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { EventCreateBody, EventUpdateBody } from "@/schemas/event";
import { PaginatedData } from "@/types/base";
import { Event, EventGetListQuery } from "@/types/event";

export const eventRequest = {
    getList: (params: EventGetListQuery) =>
        http.get<PaginatedData<Event>>(ENDPOINT_CLIENT.EVENTS, { query: params }),
    getById: (id: string) =>
        http.get<Event>(ENDPOINT_CLIENT.EVENT_DETAIL(id)),
    create: (body: EventCreateBody) =>
        http.post<Event>(ENDPOINT_CLIENT.EVENTS, body),
    update: (id: string, body: EventUpdateBody) =>
        http.put<Partial<Event>>(ENDPOINT_CLIENT.EVENT_DETAIL(id), body),
    updatePartial: (id: string, body: EventUpdateBody) =>
        http.patch<Partial<Event>>(ENDPOINT_CLIENT.EVENT_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.EVENT_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.EVENT_DETAIL(id), {}),
};
