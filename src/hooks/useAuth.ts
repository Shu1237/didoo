'use client'
import { authRequest } from "@/apiRequest/auth";
import { userRequest } from "@/apiRequest/user";
import { organizerRequest } from "@/apiRequest/organizer";
import { handleErrorApi } from "@/lib/errors";
import {
    LoginInput,
    LoginGoogleInput,
    RegisterInput,
    VerifyRegisterInput,
    ForgotPasswordInput,
    VerifyForgotPasswordInput,
    ChangeEmailInput,
    VerifyChangeEmailInput,
    ChangePasswordInput,
    LogoutInput
} from "@/schemas/auth";
import { useSessionStore } from "@/stores/sesionStore";
import { getRedirectPathForRole } from "@/utils/enum";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

async function loadProfileAndOrganizer(userId: string) {
    const { setProfile, setOrganizer } = useSessionStore.getState();
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

export const useAuth = () => {
    const { user, setSession, clearSession } = useSessionStore((state) => state);
    const router = useRouter();
    const login = useMutation({
        mutationFn: async (data: LoginInput) => {
            const res = await authRequest.loginClient(data)
            return res.data
        },
        onSuccess: async (data) => {
            setSession(data);
            await authRequest.loginServer(data);
            const u = useSessionStore.getState().user;
            if (u?.UserId) await loadProfileAndOrganizer(u.UserId);
            toast.success("Login successfully");
            router.replace(getRedirectPathForRole(u?.Role));
        },
    })

    const loginGoogle = useMutation({
        mutationFn: async (data: LoginGoogleInput) => {
            const res = await authRequest.loginGoogle(data)
            return res.data
        },
        onSuccess: async (data) => {
            setSession(data);
            await authRequest.loginServer(data);
            const u = useSessionStore.getState().user;
            if (u?.UserId) await loadProfileAndOrganizer(u.UserId);
            toast.success("Login successfully");
            router.replace(getRedirectPathForRole(u?.Role));
        },
    })

    const register = useMutation({
        mutationFn: async (data: RegisterInput) => {
            const { confirmPassword, ...payload } = data;
            const res = await authRequest.register(payload)
            return res.message
        },
        onSuccess: async (data) => {
            toast.success(data);
        },
    })

    const verifyRegister = useMutation({
        mutationFn: async (data: VerifyRegisterInput) => {
            const res = await authRequest.verifyRegister(data)
            return res.message
        },
        onSuccess: async (data) => {
            toast.success(data);
            router.replace("/login");
        },
    })

    const logout = useMutation({
        mutationFn: async (data: LogoutInput) => {
            await authRequest.logoutClient(data)
        },
        onSuccess: async () => {
            await authRequest.logoutServer()
            clearSession();
            toast.success("Logout successfully");
            router.replace("/login");
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const forgotPassword = useMutation({
        mutationFn: async (data: ForgotPasswordInput) => {
            const res = await authRequest.forgotPassword(data)
            return res.data
        },
    })

    const verifyForgotPassword = useMutation({
        mutationFn: async (data: VerifyForgotPasswordInput) => {
            const res = await authRequest.verifyForgotPassword({
                key: data.key,
                newPassword: data.password
            })
            return res.message
        },
        onSuccess: async (data) => {
            toast.success(data);
        },
    })

    const changeEmail = useMutation({
        mutationFn: async (data: ChangeEmailInput) => {
            const res = await authRequest.changeEmail(data)
            return res.message
        },
        onSuccess: async (data) => {
            toast.success(data);
        },
    })

    const verifyChangeEmail = useMutation({
        mutationFn: async (data: VerifyChangeEmailInput) => {
            const res = await authRequest.verifyChangeEmail(data)
            return res.message
        },
        onSuccess: async (data) => {
            if (user?.UserId) {
                try {
                    await authRequest.logoutClient({ userId: user.UserId });
                } catch (e) { }
            }
            await authRequest.logoutServer();
            clearSession();
            toast.success(data);
            router.replace("/login");
        }
    })

    const changePassword = useMutation({
        mutationFn: async (data: ChangePasswordInput) => {
            const res = await authRequest.changePassword({
                userId: data.userId,
                password: data.oldPassword,
                newPassword: data.password
            })
            return res.message
        },
        onSuccess: async (data) => {
            if (user?.UserId) {
                try {
                    await authRequest.logoutClient({ userId: user.UserId });
                } catch (e) { }
            }
            await authRequest.logoutServer();
            clearSession();
            toast.success(data);
            router.replace("/login");
        },
    })

    return {
        login,
        loginGoogle,
        register,
        verifyRegister,
        logout,
        forgotPassword,
        verifyForgotPassword,
        changeEmail,
        verifyChangeEmail,
        changePassword
    }
}
