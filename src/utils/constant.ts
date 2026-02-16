import { UserGetListQuery } from "@/schemas/user";
import { EventGetListQuery } from "@/schemas/event";
import { CategoryGetListQuery } from "@/schemas/category";
import { OrganizerGetListQuery } from "@/schemas/organizer";
import { EventReviewGetListQuery } from "@/schemas/eventReview";
import { FavoriteGetListQuery } from "@/schemas/favorite";
import { InteractionGetListQuery } from "@/schemas/interaction";
import { TicketGetListQuery } from "@/schemas/ticket";
import { TicketTypeGetListQuery } from "@/schemas/ticketType";

export const QUERY_KEY = {
    // User
    userList: (params?: UserGetListQuery) => ['users', params],
    userDetail: (id: string) => ['users', id],

    // Role
    roleList: ['roles'],

    // Event
    eventList: (params?: EventGetListQuery) => ['events', params],
    eventDetail: (id: string) => ['events', id],

    // Category
    categoryList: (params?: CategoryGetListQuery) => ['categories', params],
    categoryDetail: (id: string) => ['categories', id],

    // Organizer
    organizerList: (params?: OrganizerGetListQuery) => ['organizers', params],
    organizerDetail: (id: string) => ['organizers', id],

    // Event Review
    eventReviewList: (params?: EventReviewGetListQuery) => ['eventReviews', params],
    eventReviewDetail: (id: string) => ['eventReviews', id],

    // Favorite
    favoriteList: (params?: FavoriteGetListQuery) => ['favorites', params],
    favoriteDetail: (id: string) => ['favorites', id],

    // Interaction
    interactionList: (params?: InteractionGetListQuery) => ['interactions', params],
    interactionDetail: (id: string) => ['interactions', id],

    // Ticket
    ticketList: (params?: TicketGetListQuery) => ['tickets', params],
    ticketDetail: (id: string) => ['tickets', id],

    // Ticket Type
    ticketTypeList: (params?: TicketTypeGetListQuery) => ['ticketTypes', params],
    ticketTypeDetail: (id: string) => ['ticketTypes', id],

} as const;
