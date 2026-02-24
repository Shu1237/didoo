import http from "@/lib/http";
import { ENDPOINT_CLIENT } from "@/utils/endpoint";
import { EventReviewCreateBody, EventReviewUpdateBody } from "@/schemas/eventReview";
import { PaginatedData } from "@/types/base";
import { EventReview, EventReviewGetListQuery } from "@/types/eventReview";

export const eventReviewRequest = {
    getList: (params: EventReviewGetListQuery) =>
        http.get<PaginatedData<EventReview>>(ENDPOINT_CLIENT.EVENT_REVIEWS, { query: params }),
    getById: (id: string) =>
        http.get<EventReview>(ENDPOINT_CLIENT.EVENT_REVIEW_DETAIL(id)),
    create: (body: EventReviewCreateBody) =>
        http.post<EventReview>(ENDPOINT_CLIENT.EVENT_REVIEWS, body),
    update: (id: string, body: EventReviewUpdateBody) =>
        http.put<Partial<EventReview>>(ENDPOINT_CLIENT.EVENT_REVIEW_DETAIL(id), body),
    updatePartial: (id: string, body: EventReviewUpdateBody) =>
        http.patch<Partial<EventReview>>(ENDPOINT_CLIENT.EVENT_REVIEW_DETAIL(id), body),
    delete: (id: string) =>
        http.delete<null>(ENDPOINT_CLIENT.EVENT_REVIEW_DETAIL(id)),
    restore: (id: string) =>
        http.patch<null>(ENDPOINT_CLIENT.EVENT_REVIEW_DETAIL(id), {}),
};
