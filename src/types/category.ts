import { CategoryStatus } from "@/utils/enum";
import { BasePaginationQuery } from "./base";

export interface CategoryGetListQuery extends BasePaginationQuery {
    name?: string;
    status?: CategoryStatus;
}

/** Match BE CategoryDTO */
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
    status: CategoryStatus;
    parentCategory?: Category | null;
    subCategories?: Category[];
    isDeleted?: boolean;
}
