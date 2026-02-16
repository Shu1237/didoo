import { z } from "zod";

export const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string(),
});

export const loginSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu là bắt buộc"),
    location: locationSchema.optional(),
});

export const loginGoogleSchema = z.object({
    googleToken: z.string(),
    location: locationSchema.optional(),
});

export const registerSchema = z.object({
    fullName: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password tối thiểu 6 ký tự"),
    avatarUrl: z.string().url().optional(),
    gender: z.number().int().min(0).max(2).default(0),
    dateOfBirth: z.string().datetime(),
    address: z.string().optional(),
});

export const verifyRegisterSchema = z.object({
    email: z.email("Email không hợp lệ"),
    otp: z.string().length(6, "OTP phải có 6 ký tự"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Email không hợp lệ"),
});

export const verifyForgotPasswordSchema = z.object({
    email: z.email("Email không hợp lệ"),
    otp: z.string().length(6, "OTP phải có 6 ký tự"),
    newPassword: z.string().min(6, "Password tối thiểu 6 ký tự"),
});

export const changeEmailSchema = z.object({
    userId: z.string().uuid(),
    newEmail: z.email("Email không hợp lệ"),
});

export const verifyChangeEmailSchema = z.object({
    userId: z.string().uuid(),
    otp: z.string().length(6, "OTP phải có 6 ký tự"),
});

export const changePasswordSchema = z.object({
    userId: z.string().uuid(),
    oldPassword: z.string().min(1, "Mật khẩu cũ là bắt buộc"),
    newPassword: z.string().min(6, "Password mới tối thiểu 6 ký tự"),
});

export const logoutSchema = z.object({
    userId: z.string().uuid(),
});

export const refreshSchema = z.object({
    id: z.string().uuid(),
    accessToken: z.string(),
    refreshToken: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type LoginGoogleInput = z.infer<typeof loginGoogleSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyRegisterInput = z.infer<typeof verifyRegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyForgotPasswordInput = z.infer<typeof verifyForgotPasswordSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type VerifyChangeEmailInput = z.infer<typeof verifyChangeEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;