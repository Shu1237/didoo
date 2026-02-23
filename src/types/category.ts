import { BasePaginationQuery } from "./base";

export interface CategoryGetListQuery extends BasePaginationQuery {
    name?: string;
    status?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    status: string;
    parentCategory?: Category | null;
    subCategories?: Category[];
}
