import { z } from "zod";

export const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export const loginSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu là bắt buộc"),
    location: locationSchema,
});

export const loginGoogleSchema = z.object({
    googleToken: z.string(),
    location: locationSchema,
});

export const registerSchema = z.object({
    fullName: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Password tối thiểu 6 ký tự"),
    avatarUrl: z.url().optional(),
    gender: z.number().int().min(0).max(2).default(0),
    dateOfBirth: z.coerce.date({
        message: "Vui lòng chọn ngày sinh",
    }),
    address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export const verifyRegisterSchema = z.object({
    email: z.email("Email không hợp lệ"),
    otp: z.string().length(6, "OTP phải có 6 ký tự"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Email không hợp lệ"),
    clientUri: z.string().optional(),
});

export const verifyForgotPasswordSchema = z.object({
    key: z.string(),
    newPassword: z.string().min(6, "Password tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Password tối thiểu 6 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export const changeEmailSchema = z.object({
    userId: z.uuid(),
    newEmail: z.email("Email không hợp lệ"),
});

export const verifyChangeEmailSchema = z.object({
    userId: z.uuid(),
    otp: z.string().length(6, "OTP phải có 6 ký tự"),
});

export const changePasswordSchema = z.object({
    userId: z.uuid(),
    oldPassword: z.string().min(1, "Mật khẩu cũ là bắt buộc"),
    newPassword: z.string().min(6, "Password mới tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Password mới tối thiểu 6 ký tự"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export const logoutSchema = z.object({
    userId: z.uuid(),
});

export const refreshSchema = z.object({
    id: z.uuid(),
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