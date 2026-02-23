import { CategoryGetListQuery } from "@/types/category";
import { EventGetListQuery } from "@/types/event";
import { EventReviewGetListQuery } from "@/types/eventReview";
import { FavoriteGetListQuery } from "@/types/favorite";
import { InteractionGetListQuery } from "@/types/interaction";
import { OrganizerGetListQuery } from "@/types/organizer";
import { TicketGetListQuery } from "@/types/ticket";
import { TicketTypeGetListQuery } from "@/types/ticketType";
import { UserGetListQuery } from "@/types/user";


export const KEY = {
    users: ['users'],
    roles: ['roles'],
    events: ['events'],
    categories: ['categories'],
    organizers: ['organizers'],
    eventReviews: ['event-reviews'],
    favorites: ['favorites'],
    interactions: ['interactions'],
    tickets: ['tickets'],
    ticketTypes: ['ticket-types'],
} as const;

export const QUERY_KEY = {
    users: {
        list: (query?: UserGetListQuery) => [...KEY.users, 'list', query] as const,
        detail: (id: string) => [...KEY.users, 'detail', id] as const,
    },
    roles: {
        list: () => [...KEY.roles, 'list'] as const,
    },
    events: {
        list: (query?: EventGetListQuery) => [...KEY.events, 'list', query] as const,
        detail: (id: string) => [...KEY.events, 'detail', id] as const,
    },
    categories: {
        list: (query?: CategoryGetListQuery) => [...KEY.categories, 'list', query] as const,
        detail: (id: string) => [...KEY.categories, 'detail', id] as const,
    },
    organizers: {
        list: (query?: OrganizerGetListQuery) => [...KEY.organizers, 'list', query] as const,
        detail: (id: string) => [...KEY.organizers, 'detail', id] as const,
    },
    eventReviews: {
        list: (query?: EventReviewGetListQuery) => [...KEY.eventReviews, 'list', query] as const,
        detail: (id: string) => [...KEY.eventReviews, 'detail', id] as const,
    },
    favorites: {
        list: (query?: FavoriteGetListQuery) => [...KEY.favorites, 'list', query] as const,
        detail: (id: string) => [...KEY.favorites, 'detail', id] as const,
    },
    interactions: {
        list: (query?: InteractionGetListQuery) => [...KEY.interactions, 'list', query] as const,
        detail: (id: string) => [...KEY.interactions, 'detail', id] as const,
    },
    tickets: {
        list: (query?: TicketGetListQuery) => [...KEY.tickets, 'list', query] as const,
        detail: (id: string) => [...KEY.tickets, 'detail', id] as const,
    },
    ticketTypes: {
        list: (query?: TicketTypeGetListQuery) => [...KEY.ticketTypes, 'list', query] as const,
        detail: (id: string) => [...KEY.ticketTypes, 'detail', id] as const,
    },
} as const;
