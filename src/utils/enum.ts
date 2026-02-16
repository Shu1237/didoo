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
    ADMIN = 'Admin',
    ORGANIZER = 'Organizer',
    USER = 'User',
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