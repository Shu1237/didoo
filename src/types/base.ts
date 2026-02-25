export type ValidationErrorItem = {
  field: string;
  detail: string;
}

export type ResponseData<T> = {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  data: T;
  listErrors: ValidationErrorItem[];
};

export type ResponseError = {
  isSuccess: false;
  message: string;
  statusCode: number;
  data: null;
  listErrors: ValidationErrorItem[];
};

export type PaginatedData<T> = {
  totalItems: number;
  totalCount?: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  items: T[];
};



export type BasePaginationResponse<T> = ResponseData<PaginatedData<T>>;

export interface BasePaginationQuery {
  PageNumber?: number;
  PageSize?: number;
  IsDescending?: boolean;
  IsDeleted?: boolean;
  Fields?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AuthContextType {
  setTokenFromContext: (accessToken: string, refreshToken: string) => void;
}
