

export type ResponseData<T> = {
    message: string;
    data: T;
    isSuccess: boolean;
};

export type ResponseError = {
    data:null;
    isSuccess: false;
    message: string;
    errors: ValidationErrorItem[];

};


export type ValidationErrorItem = {
    field: string;
    detail: string;
}


export type UserRole = "user" | "organizer" | "admin" | "staff";

export type JWTUserType = {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  iat?: number;
  exp?: number;
};
export interface Category {
  id: number;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: string;
  lat: number;
  lng: number;
  status: string;
  category: string;
  organizer: {
    name: string;
    avatar: string;
  };
}
export interface AuthContextType {
  setTokenFromContext: (accessToken: string, refreshToken: string) => void;
}
