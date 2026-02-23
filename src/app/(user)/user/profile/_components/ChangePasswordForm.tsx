"use client";

import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordInput, changePasswordSchema } from "@/schemas/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Save, X, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { handleErrorApi } from "@/lib/errors";
import { useSessionStore } from "@/stores/sesionStore";

export default function ChangePasswordForm() {
    const { changePassword } = useAuth();
    const user = useSessionStore((state) => state.user);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isValid },
    } = useForm<ChangePasswordInput>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            userId: user?.UserId || "",
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });

    const currentPassword = watch("password");
    const isPasswordSecure =
        currentPassword.length >= 8 &&
        /[A-Z]/.test(currentPassword) &&
        /[!@#$%^&*(),?":{}|<>]/.test(currentPassword);

    const onSubmit = async (data: ChangePasswordInput) => {
        try {
            await changePassword.mutateAsync(data);
        } catch (error: any) {
            handleErrorApi({
                error,
                setError,
            });
        }
    };

    return (
        <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden rounded-[32px]">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
                <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <div className="p-2 bg-[#FF9B8A]/10 rounded-xl">
                        <Key className="w-5 h-5 text-[#FF9B8A]" />
                    </div>
                    Đổi mật khẩu
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium ml-12">Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <input type="hidden" {...register("userId")} />

                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mật khẩu cũ</label>
                        <div className="relative">
                            <Input
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu cũ"
                                {...register("oldPassword")}
                                className={`h-12 bg-white border-slate-200 rounded-2xl px-5 pr-12 text-sm font-semibold text-slate-900 focus-visible:ring-[#FF9B8A]/20 focus-visible:border-[#FF9B8A] transition-all placeholder:text-slate-300 ${errors.oldPassword ? "border-red-500 bg-red-50/30" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showOldPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <p className="text-[10px] text-red-500 ml-4 mt-1 font-bold">{errors.oldPassword.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
                            <div className="relative">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Nhập mật khẩu mới"
                                    {...register("password")}
                                    className={`h-12 bg-white border-slate-200 rounded-2xl px-5 pr-12 text-sm font-semibold text-slate-900 focus-visible:ring-[#FF9B8A]/20 focus-visible:border-[#FF9B8A] transition-all placeholder:text-slate-300 ${errors.password ? "border-red-500 bg-red-50/30" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showNewPassword ? <Lock className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[11px] text-red-500 ml-4 mt-1 font-bold leading-relaxed">{errors.password.message}</p>
                            )}

                            {/* Password Requirements Checklist */}
                            <div className="mt-3 space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Yêu cầu bảo mật:</p>
                                <div className="flex items-center gap-2 text-[11px] font-bold">
                                    <div className={`w-1.5 h-1.5 rounded-full ${watch("password").length >= 8 ? "bg-green-500" : "bg-slate-300"}`} />
                                    <span className={watch("password").length >= 8 ? "text-slate-700" : "text-slate-400"}>Tối thiểu 8 ký tự</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(watch("password")) ? "bg-green-500" : "bg-slate-300"}`} />
                                    <span className={/[A-Z]/.test(watch("password")) ? "text-slate-700" : "text-slate-400"}>Có 1 chữ hoa</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-bold">
                                    <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?\":{}|<>]/.test(watch("password")) ? "bg-green-500" : "bg-slate-300"}`} />
                                    <span className={/[!@#$%^&*(),.?\":{}|<>]/.test(watch("password")) ? "text-slate-700" : "text-slate-400"}>Có 1 ký tự đặc biệt</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Nhập lại mật khẩu mới"
                                    {...register("confirmPassword")}
                                    className={`h-12 bg-white border-slate-200 rounded-2xl px-5 pr-12 text-sm font-semibold text-slate-900 focus-visible:ring-[#FF9B8A]/20 focus-visible:border-[#FF9B8A] transition-all placeholder:text-slate-300 ${errors.confirmPassword ? "border-red-500 bg-red-50/30" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-[11px] text-red-500 ml-4 mt-1 font-bold">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-8 border-t border-slate-50">
                        <Button type="button" variant="ghost" className="rounded-full px-8 text-slate-500 font-bold hover:bg-slate-100 h-11">
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={changePassword.isPending}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 shadow-lg shadow-slate-900/10 font-bold flex items-center gap-2 h-11"
                        >
                            {changePassword.isPending ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Đổi mật khẩu
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
