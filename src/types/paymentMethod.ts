import { BasePaginationQuery } from "./base";

/** Match BE PaymentMethodGetListQuery */
export interface PaymentMethodGetListQuery extends BasePaginationQuery {
    name?: string;
    status?: number;
}

/** Match BE PaymentMethodDTO */
export interface PaymentMethod {
    id: string;
    name: string;
    description?: string;
    status: string; // Active, Inactive
    createdAt?: string;
}
