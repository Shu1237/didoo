// endpoint.ts
export const ENDPOINT_SERVER = {
    LOGIN: '/api/login',
    REFRESH: '/api/refresh_token',
    LOGOUT: '/api/logout',
}

export const ENDPOINT_CLIENT = {
    // Auth
    LOGIN: '/auth/login',
    LOGIN_GOOGLE: '/auth/login-google',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    VERIFY_REGISTER: '/auth/verify-register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_FORGOT_PASSWORD: '/auth/verify-forgot-password',
    CHANGE_EMAIL: '/auth/change-email',
    VERIFY_CHANGE_EMAIL: '/auth/verify-change-email',
    CHANGE_PASSWORD: '/auth/change-password',
    // Users
    USERS: '/users',
    USER_DETAIL: (id: string) => `/users/${id}`,

    // Roles
    ROLES: '/roles',
    ROLE_DETAIL: (id: string) => `/roles/${id}`,
    ROLES_DUMB: '/roles/dumb',

    // Events
    EVENTS: '/events',
    EVENT_DETAIL: (id: string) => `/events/${id}`,
    EVENT_STATUS: (id: string) => `/events/${id}/status`,

    // Categories
    CATEGORIES: '/categories',
    CATEGORY_DETAIL: (id: string) => `/categories/${id}`,

    // Organizers
    ORGANIZERS: '/organizers',
    ORGANIZER_DETAIL: (id: string) => `/organizers/${id}`,
    ORGANIZER_VERIFY: (id: string) => `/organizers/${id}/verify`,

    // Event Reviews
    EVENT_REVIEWS: '/eventreviews',
    EVENT_REVIEW_DETAIL: (id: string) => `/eventreviews/${id}`,

    // Favorites
    FAVORITES: '/favorites',
    FAVORITE_DETAIL: (id: string) => `/favorites/${id}`,
    FAVORITE_DELETE: (userId: string, eventId: string) => `/favorites/${userId}/${eventId}`,
    FAVORITE_SOFT_DELETE: (userId: string, eventId: string) => `/favorites/${userId}/${eventId}/soft`,

    // Interactions
    INTERACTIONS: '/interactions',
    INTERACTION_DETAIL: (id: string) => `/interactions/${id}`,
    INTERACTION_DELETE: (userId: string, eventId: string, type: number) => `/interactions/${userId}/${eventId}/${type}`,
    INTERACTION_SOFT_DELETE: (userId: string, eventId: string, type: number) => `/interactions/${userId}/${eventId}/${type}/soft`,

    // Tickets
    TICKETS: '/tickets',
    TICKET_DETAIL: (id: string) => `/tickets/${id}`,

    // Ticket Types
    TICKET_TYPES: '/tickettypes',
    TICKET_TYPE_DETAIL: (id: string) => `/tickettypes/${id}`,

    // Bookings
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: (id: string) => `/bookings/${id}`,

    // Booking Details
    BOOKING_DETAILS: '/bookingdetails',
    BOOKING_DETAIL_ITEM: (id: string) => `/bookingdetails/${id}`,

    // Payment Methods
    PAYMENT_METHODS: '/paymentmethods',
    PAYMENT_METHOD_DETAIL: (id: string) => `/paymentmethods/${id}`,

    ORDER_DETAIL: (id: string) => `/orders/coordinator/${id}`, // Keeping existing ONE
}
