"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSessionStore } from "@/stores/sesionStore";
import { authRequest } from "@/apiRequest/auth";
import { handleErrorApi } from "@/lib/errors";
import { AuthContextType } from "@/types/base";
import { decodeJWT } from "@/lib/utils";
import { JWTUserType } from "@/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Profile + Organizer: dùng useProfileWithOrganizer (TanStack Query) thay vì fetch trong AuthContext */

export const AuthProvider = ({
    children,
    initialAccessToken,
    initialRefreshToken,
}: {
    children: ReactNode;
    initialAccessToken?: string | null;
    initialRefreshToken?: string | null;
}) => {
    const { setSession } = useSessionStore((state) => state);
    const [isHydrated, setIsHydrated] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const setTokenFromContext = (accessToken: string, refreshToken: string) => {
        setSession({ accessToken, refreshToken });
    };

    useEffect(() => {
        const initializeAuth = async () => {
            if (initialAccessToken && initialRefreshToken) {
                const decoded = decodeJWT<JWTUserType>(initialAccessToken);
                const isExpired = decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000);

                // BE chỉ refresh khi token ĐÃ hết hạn
                if (isExpired && decoded?.UserId) {
                    setIsRefreshing(true);
                    try {
                        const result = await authRequest.refreshTokenClient({
                            id: decoded.UserId,
                            accessToken: initialAccessToken,
                            refreshToken: initialRefreshToken,
                        });
                        if (!result.isSuccess || !result.data?.accessToken || !result.data?.refreshToken) {
                            throw new Error(result.message || "Invalid refresh response");
                        }
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = result.data;
                        setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken });
                        await authRequest.refreshTokenServer({
                            accessToken: newAccessToken,
                            refreshToken: newRefreshToken,
                        });
                    } catch (error) {
                        handleErrorApi({ error });
                        try {
                            await authRequest.logoutServer();
                        } catch {
                            /* ignore */
                        }
                        window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
                        return;
                    } finally {
                        setIsRefreshing(false);
                    }
                } else if (!isExpired) {
                    setSession({ accessToken: initialAccessToken, refreshToken: initialRefreshToken });
                } else {
                    // Token hết hạn nhưng không decode được UserId -> redirect login
                    try {
                        await authRequest.logoutServer();
                    } catch {
                        /* ignore */
                    }
                    window.location.href = "/login";
                    return;
                }
                setIsHydrated(true);
                return;
            }

            if (!initialRefreshToken) {
                setIsHydrated(true);
                return;
            }

            // Chỉ có refresh token: BE RefreshCommand cần id (từ access token) - không decode được từ refresh token
            if (!initialAccessToken && initialRefreshToken) {
                try {
                    await authRequest.logoutServer();
                } catch {
                    /* ignore */
                }
                window.location.href = "/login";
                return;
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
