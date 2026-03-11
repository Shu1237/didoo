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
    TICKET_TYPES_ARRAY: '/tickettypes/array',
    TICKET_TYPE_DETAIL: (id: string) => `/tickettypes/${id}`,
    TICKET_TYPE_DECREMENT: (id: string) => `/tickettypes/${id}/decrement`,

    // Ticket Listings
    TICKET_LISTINGS: '/ticketlistings',
    TICKET_LISTING_DETAIL: (id: string) => `/ticketlistings/${id}`,
    TICKET_LISTING_VALIDATE: (id: string) => `/ticketlistings/${id}/validate`,
    TICKET_LISTING_CANCEL: (id: string) => `/ticketlistings/${id}/cancel`,
    TICKET_LISTING_MARK_SOLD: (id: string) => `/ticketlistings/${id}/mark-sold`,

    // Bookings
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: (id: string) => `/bookings/${id}`,

    // Booking Details
    BOOKING_DETAILS: '/bookingdetails',
    BOOKING_DETAIL_ITEM: (id: string) => `/bookingdetails/${id}`,

    // Payment Methods
    PAYMENT_METHODS: '/paymentmethods',
    PAYMENT_METHOD_DETAIL: (id: string) => `/paymentmethods/${id}`,

    // Payments
    PAYMENTS: '/payments',
    PAYMENT_DETAIL: (id: string) => `/payments/${id}`,
    PAYMENT_CALLBACK: '/payments/callback',

    // Trade Bookings
    TRADE_BOOKINGS: '/trade-bookings',

    // Resales
    RESALES: '/resales',
    RESALE_DETAIL: (id: string) => `/resales/${id}`,

    // Resale Transactions
    RESALE_TRANSACTIONS: '/resaletransactions',
    RESALE_TRANSACTION_DETAIL: (id: string) => `/resaletransactions/${id}`,

    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_DETAIL: (id: string) => `/notifications/${id}`,

    // Check-ins
    CHECKINS: '/checkins',
    CHECKIN_DETAIL: (id: string) => `/checkins/${id}`,
}
