'use client'
import { authRequest } from "@/apiRequest/auth";
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
import { useMutation } from "@tanstack/react-query";


export const useAuth = () => {
    const login = useMutation({
        mutationFn: async (data: LoginInput) => {
            const res = await authRequest.loginClient(data)
            return res.data
        },
        onSuccess: async (data) => {
            await authRequest.loginServer(data)
        },
        onError: (error) => {
            handleErrorApi({ error })
        }

    })

    const loginGoogle = useMutation({
        mutationFn: async (data: LoginGoogleInput) => {
            const res = await authRequest.loginGoogle(data)
            return res.data
        },
        onSuccess: async (data) => {
            await authRequest.loginServer(data)
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const register = useMutation({
        mutationFn: async (data: RegisterInput) => {
            const res = await authRequest.register(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const verifyRegister = useMutation({
        mutationFn: async (data: VerifyRegisterInput) => {
            const res = await authRequest.verifyRegister(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const logout = useMutation({
        mutationFn: async (data: LogoutInput) => {
            await authRequest.logoutClient(data)
        },
        onSuccess: async () => {
            await authRequest.logoutServer()
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
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const verifyForgotPassword = useMutation({
        mutationFn: async (data: VerifyForgotPasswordInput) => {
            const res = await authRequest.verifyForgotPassword(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const changeEmail = useMutation({
        mutationFn: async (data: ChangeEmailInput) => {
            const res = await authRequest.changeEmail(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const verifyChangeEmail = useMutation({
        mutationFn: async (data: VerifyChangeEmailInput) => {
            const res = await authRequest.verifyChangeEmail(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
    })

    const changePassword = useMutation({
        mutationFn: async (data: ChangePasswordInput) => {
            const res = await authRequest.changePassword(data)
            return res.data
        },
        onError: (error) => {
            handleErrorApi({ error })
        }
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
