
export type ResponseData<T> = {
    data: T;
    isSuccess: boolean;
    message: string;

}

export type EventCardData = {
    id: number;
    title: string;
    subtitle?: string;
    date: string;
    time?: string;
    location: string;
    priceRange: string;
    imageUrl: string;
}
export interface AuthContextType {
  setTokenFromContext: (accessToken: string, refreshToken: string) => void;
}