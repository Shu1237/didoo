import { decodeJWT } from "@/lib/utils";
import { JWTUserType } from "@/types/user";
import { create } from "zustand";




interface SessionState {
    accessToken: string | null;
    refreshToken: string | null;
    user: JWTUserType | null;

    setSession: (params: {
        accessToken: string;
        refreshToken: string;
    }) => void;

    updateSession: (params: {
        accessToken: string;
        refreshToken: string;
    }) => void;


    clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,

    /* ===== INIT / LOGIN ===== */
    setSession: ({ accessToken, refreshToken }) => {
        try {
            const user = decodeJWT<JWTUserType>(accessToken);
            set({
                accessToken,
                refreshToken,
                user,
            });
        } catch (error) {
            console.error("Invalid access token", error);
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
            });
        }
    },
    updateSession: ({ accessToken, refreshToken }) => {
        try {
            set({
                accessToken,
                refreshToken
            })
        } catch (error) {
            console.error("Invalid access token", error);
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
            });
        }
    },
    /* ===== LOGOUT / EXPIRED ===== */
    clearSession: () => {
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
        });
    },
}));
