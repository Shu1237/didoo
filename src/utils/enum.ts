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
    ADMIN = '346637b8-09e2-42a1-aae7-71340c19e8f5',
    ORGANIZER = '4aa3c956-70b7-4ac1-a7ca-28f5de93755d',
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
    DRAFT = 'Draft',
    PUBLISHED = 'Published',
    CANCELLED = 'Cancelled',
    COMPLETED = 'Completed',
}

export enum OrganizerStatus {
    PENDING = 'Pending',
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    REJECTED = 'Rejected',
}

export enum CategoryStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
}