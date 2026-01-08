export type ResponseData<T> = {
  data: T;
  isSuccess: boolean;
  message: string;
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
