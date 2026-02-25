import { Roles } from "@/utils/enum";
import { BasePaginationQuery } from "./base";


export type JWTUserType = {
    jti: string;
    UserId: string;
    FullName: string;
    Email: string;
    RoleId: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
};

export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface UserGetListQuery extends BasePaginationQuery {
    FullName?: string;
    Email?: string;
    Phone?: string;
    IsVerified?: boolean;
    Gender?: number;
    Status?: string;
    HasLocation?: boolean;
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    isVerified: boolean;
    avatarUrl?: string;
    gender: number;
    dateOfBirth: string;
    address?: string;
    status: string;
    role: Role;
    organizerId?: string | null;
    locations: any[];
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
}
