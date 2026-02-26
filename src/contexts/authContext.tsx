"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSessionStore } from "@/stores/sesionStore";
import { authRequest } from "@/apiRequest/auth";
import { userRequest } from "@/apiRequest/user";
import { organizerRequest } from "@/apiRequest/organizer";
import { handleErrorApi } from "@/lib/errors";
import { AuthContextType } from "@/types/base";
import { decodeJWT } from "@/lib/utils";
import { JWTUserType, User } from "@/types/user";
import { Organizer } from "@/types/organizer";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfileAndOrganizer(
    userId: string,
    setProfile: (p: User) => void,
    setOrganizer: (o: Organizer | null) => void,
) {
    try {
        const profileRes = await userRequest.getById(userId);
        const profile = profileRes.data;
        setProfile(profile);

        if (profile?.organizerId) {
            try {
                const orgRes = await organizerRequest.getById(profile.organizerId);
                setOrganizer(orgRes.data ?? null);
            } catch {
                setOrganizer(null);
            }
        } else {
            setOrganizer(null);
        }
    } catch (error) {
        console.error("Failed to fetch profile", error);
    }
}

export const AuthProvider = ({
    children,
    initialAccessToken,
    initialRefreshToken,
}: {
    children: ReactNode;
    initialAccessToken?: string | null;
    initialRefreshToken?: string | null;
}) => {
    const { setSession, setProfile, setOrganizer } = useSessionStore((state) => state);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const setTokenFromContext = (accessToken: string, refreshToken: string) => {
        setSession({ accessToken, refreshToken });
    };

    useEffect(() => {
        const initializeAuth = async () => {
            if (initialAccessToken && initialRefreshToken) {
                setSession({ accessToken: initialAccessToken, refreshToken: initialRefreshToken });
                const decoded = decodeJWT<JWTUserType>(initialAccessToken);
                if (decoded?.UserId) {
                    await fetchProfileAndOrganizer(decoded.UserId, setProfile, setOrganizer);
                }
                setIsHydrated(true);
                return;
            }

            if (!initialRefreshToken) {
                setIsHydrated(true);
                return;
            }

            if (!initialAccessToken && initialRefreshToken) {
                setIsRefreshing(true);
                try {
                    const decodedRefresh = decodeJWT<JWTUserType>(initialRefreshToken);
                    if (!decodedRefresh?.UserId) throw new Error("Invalid refresh token payload");

                    const result = await authRequest.refreshTokenClient({
                        id: decodedRefresh.UserId,
                        accessToken: initialAccessToken || "",
                        refreshToken: initialRefreshToken,
                    });

                    if (!result.data?.accessToken || !result.data?.refreshToken) {
                        throw new Error("Invalid refresh token response");
                    }

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;
                    setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken });

                    await authRequest.refreshTokenServer({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    });

                    const decoded = decodeJWT<JWTUserType>(newAccessToken);
                    if (decoded?.UserId) {
                        await fetchProfileAndOrganizer(decoded.UserId, setProfile, setOrganizer);
                    }
                } catch (error) {
                    handleErrorApi({ error });
                    try {
                        await authRequest.logoutServer();
                    } catch (logoutError) {
                        console.error("Failed to clear cookies:", logoutError);
                    }
                    window.location.href = "/login";
                    return;
                } finally {
                    setIsRefreshing(false);
                }
            }

            setIsHydrated(true);
        };

        initializeAuth();
    }, []);

    if (!isHydrated || isRefreshing) {
        return (
            <div className="loader">
                <div className="justify-content-center jimu-primary-loading"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ setTokenFromContext }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuthContext must be used within AuthProvider");
    return context;
};
