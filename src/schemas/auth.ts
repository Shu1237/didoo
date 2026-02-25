import { z } from "zod";

export const locationSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional().default(""),
});

export const loginSchema = z.object({
    email: z.email("Email không hợp lệ"),
    password: z.string().min(1, "Mật khẩu là bắt buộc"),
    location: locationSchema,
});

export const loginGoogleSchema = z.object({
    GoogleToken: z.string(),
    Location: locationSchema,
});

export const registerSchema = z.object({
    fullName: z.string().min(1, "Họ tên là bắt buộc"),
    email: z.email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: z.string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
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
    password: z.string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export const changeEmailSchema = z.object({
    userId: z.string(),
    newEmail: z.email("Email không hợp lệ"),
});

export const verifyChangeEmailSchema = z.object({
    userId: z.string(),
    otp: z.string().length(6, "OTP phải có 6 ký tự"),
});

export const changePasswordSchema = z.object({
    userId: z.string(),
    oldPassword: z.string().min(1, "Mật khẩu cũ là bắt buộc"),
    password: z.string()
        .min(8, "Mật khẩu tối thiểu 8 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export const logoutSchema = z.object({
    userId: z.string(),
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