import { Roles } from "@/utils/enum";
import { BasePaginationQuery } from "./base";


export type JWTUserType = {
    id: string;
    email: string;
    role: Roles;
    name: string;
};
export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface UserGetListQuery extends BasePaginationQuery {
    fullName?: string;
    email?: string;
    phone?: string;
    isVerified?: boolean;
    gender?: number;
    status?: string;
    hasLocation?: boolean;
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
}
