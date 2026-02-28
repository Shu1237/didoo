import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { TicketTypeCreateBody, TicketTypeUpdateBody } from "@/schemas/ticketType";
import { PaginatedData } from "@/types/base";
import { TicketType, TicketTypeGetListQuery } from "@/types/ticketType";

export const ticketTypeRequest = {
    getList: (params: TicketTypeGetListQuery) =>
        http.get<PaginatedData<TicketType>>(ENDPOINT_CLIENT.TICKET_TYPES, {
            query: params,
            skipAuth: true,
        }),
    getById: (id: string) =>
        http.get<TicketType>(ENDPOINT_CLIENT.TICKET_TYPE_DETAIL(id)),
    create: (body: TicketTypeCreateBody) =>
        http.post<TicketType>(ENDPOINT_CLIENT.TICKET_TYPES, body),
    update: (id: string, body: TicketTypeUpdateBody) =>
        http.put<Partial<TicketType>>(ENDPOINT_CLIENT.TICKET_TYPE_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.TICKET_TYPE_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.TICKET_TYPE_DETAIL(id), {}),
};
