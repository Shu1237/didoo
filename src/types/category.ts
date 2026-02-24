import { CategoryStatus } from "@/utils/enum";
import { BasePaginationQuery } from "./base";

export interface CategoryGetListQuery extends BasePaginationQuery {
    name?: string;
    status?: CategoryStatus;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    status: CategoryStatus;
    createdAt?: string;
    updatedAt?: string;
    isDeleted?: boolean;
    parentCategory?: Category | null;
    parentCategoryId?: string | null;
    subCategories?: Category[];
}
