import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { TicketCreateBody, TicketUpdateBody } from "@/schemas/ticket";
import { PaginatedData } from "@/types/base";
import { Ticket, TicketGetListQuery } from "@/types/ticket";

export const ticketRequest = {
    getList: (params: TicketGetListQuery) =>
        http.get<PaginatedData<Ticket>>(ENDPOINT_CLIENT.TICKETS, { query: params }),
    getById: (id: string) =>
        http.get<Ticket>(ENDPOINT_CLIENT.TICKET_DETAIL(id)),
    create: (body: TicketCreateBody) =>
        http.post<Ticket>(ENDPOINT_CLIENT.TICKETS, body),
    update: (id: string, body: TicketUpdateBody) =>
        http.put<Partial<Ticket>>(ENDPOINT_CLIENT.TICKET_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.TICKET_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.TICKET_DETAIL(id), {}),
};
