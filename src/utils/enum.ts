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
    ORGANIZER = '346637b8-09e2-42a1-aae7-71340c19e8f5',
    USER = 'a9d8183a-c7c3-4e08-b31a-9a2f603bef0e',
    GUEST = 'c2a05f94-054a-4127-b1a4-15403bcebc97',
}

/** Redirect path theo role - dùng cho auth layout và useAuth */
export const ROLE_REDIRECTS: Record<Roles, string> = {
    [Roles.ADMIN]: "/admin/dashboard",
    [Roles.ORGANIZER]: "/organizer/dashboard",
    [Roles.USER]: "/home",
    [Roles.GUEST]: "/home",
};

export function getRedirectPathForRole(roleId: string | undefined): string {
    if (!roleId) return "/home";
    return ROLE_REDIRECTS[roleId as Roles] ?? "/home";
}

export enum Gender {
    MALE = 0,
    FEMALE = 1,
    OTHER = 2,
}

/** api.md: 1=View, 2=Heart, 3=Save */
export enum InteractionType {
    VIEW = 1,
    HEART = 2,
    SAVE = 3,
}

/** api.md: 1=Available, 2=Full, 3=Unavailable, 4=Locked */
export enum TicketStatus {
    AVAILABLE = 1,
    FULL = 2,
    UNAVAILABLE = 3,
    LOCKED = 4,
}

/** api.md: 1=Draft, 2=Published, 3=Cancelled, 4=Opened, 5=Closed */
export enum EventStatus {
    DRAFT = 1,
    PUBLISHED = 2,
    CANCELLED = 3,
    OPENED = 4,
    CLOSED = 5,
}

/** api.md: 1=Pending, 2=Verified, 3=Banned */
export enum OrganizerStatus {
    PENDING = 1,
    VERIFIED = 2,
    BANNED = 3,
}

/** api.md: 1=Active, 2=Inactive */
export enum CategoryStatus {
    ACTIVE = 1,
    INACTIVE = 2,
}