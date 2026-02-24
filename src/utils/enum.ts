export enum HttpErrorCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
}

export enum Roles {
    ADMIN = '4aa3c956-70b7-4ac1-a7ca-28f5de93755d',
    ORGANIZER = '7ae3c956-70b7-4ac1-a7ca-28f5de93755d',
    USER = 'a9d8183a-c7c3-4e08-b31a-9a2f603bef0e',
    GUEST = 'c2a05f94-054a-4127-b1a4-15403bcebc97',
}

export enum Gender {
    MALE = 0,
    FEMALE = 1,
    OTHER = 2,
}

export enum InteractionType {
    VIEW = 0,
    LIKE = 1,
    SHARE = 2,
    COMMENT = 3,
}

export enum TicketStatus {
    READY = 0,
    SOLD = 1,
    EXPIRED = 2,
    CANCELLED = 3,
}

export enum EventStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    CANCELLED = 2,
    COMPLETED = 3,
}

export enum OrganizerStatus {
    PENDING = 0,
    ACTIVE = 1,
    INACTIVE = 2,
    REJECTED = 3,
}

export enum CategoryStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}