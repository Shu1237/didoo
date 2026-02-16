import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { InteractionCreateBody } from "@/schemas/interaction";
import { PaginatedData } from "@/types/base";
import { Interaction, InteractionGetListQuery } from "@/types/interaction";

export const interactionRequest = {
    getList: (params: InteractionGetListQuery) =>
        http.get<PaginatedData<Interaction>>(ENDPOINT_CLIENT.INTERACTIONS, { query: params }),
    getById: (id: string) =>
        http.get<Interaction>(ENDPOINT_CLIENT.INTERACTION_DETAIL(id)),
    create: (body: InteractionCreateBody) =>
        http.post<Interaction>(ENDPOINT_CLIENT.INTERACTIONS, body),
    delete: (userId: string, eventId: string, type: number) =>
        http.delete<null>(ENDPOINT_CLIENT.INTERACTION_DELETE(userId, eventId, type)),
    softDelete: (userId: string, eventId: string, type: number) =>
        http.delete<null>(ENDPOINT_CLIENT.INTERACTION_SOFT_DELETE(userId, eventId, type)),
    restore: (userId: string, eventId: string, type: number) =>
        http.patch<null>(ENDPOINT_CLIENT.INTERACTION_DELETE(userId, eventId, type), {}),
};
