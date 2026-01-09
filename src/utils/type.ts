export type ResponseData<T> = {
  data: T;
  isSuccess: boolean;
  message: string;
};

export type UserRole = "user" | "organizer" | "admin" | "staff";

export type JWTUserType = {
  id: number;
  email: string;
  role: UserRole;
  name?: string;
  iat?: number;
  exp?: number;
};

export type EventCardData = {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  category: string;
  location: string;
  priceRange: string;
  imageUrl: string;
  lat: number;
  lng: number;
};

export interface AuthContextType {
  setTokenFromContext: (accessToken: string, refreshToken: string) => void;
}
