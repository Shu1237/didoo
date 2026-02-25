"use client";

import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEmailInput, VerifyChangeEmailInput, changeEmailSchema, verifyChangeEmailSchema } from "@/schemas/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Save, X, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { handleErrorApi } from "@/lib/errors";
import { useSessionStore } from "@/stores/sesionStore";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

export default function ChangeEmailForm() {
    const { changeEmail, verifyChangeEmail } = useAuth();
    const user = useSessionStore((state) => state.user);
    const [step, setStep] = useState(1);
    const [newEmail, setNewEmail] = useState("");

    const formChange = useForm<ChangeEmailInput>({
        resolver: zodResolver(changeEmailSchema),
        defaultValues: {
            userId: user?.UserId || "",
            newEmail: "",
        },
        mode: "onChange",
    });

    const formVerify = useForm<VerifyChangeEmailInput>({
        resolver: zodResolver(verifyChangeEmailSchema),
        defaultValues: {
            userId: user?.UserId || "",
            otp: "",
        },
        mode: "onChange",
    });

    const onSendCode = async (data: ChangeEmailInput) => {
        try {
            await changeEmail.mutateAsync(data);
            setNewEmail(data.newEmail);
            setStep(2);
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: formChange.setError,
            });
        }
    };

    const onVerify = async (data: VerifyChangeEmailInput) => {
        try {
            await verifyChangeEmail.mutateAsync(data);
        } catch (error: any) {
            handleErrorApi({
                error,
                setError: formVerify.setError,
            });
        }
    };

    return (
        <AnimatePresence mode="wait">
            {step === 1 ? (
                <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={formChange.handleSubmit(onSendCode)}
                    className="space-y-6"
                >
                    <div className="space-y-3 text-center p-6 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Email hiện tại</p>
                        <p className="text-xl font-black text-slate-800 tracking-tight">{user?.Email}</p>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-[13px] font-bold text-slate-400 ml-1">Email mới</label>
                        <Input
                            type="email"
                            placeholder="new-email@gmail.com"
                            {...formChange.register("newEmail")}
                            className={`h-12 bg-slate-50 border-slate-100 rounded-2xl px-5 text-sm font-semibold text-slate-900 focus-visible:ring-[#FF9B8A]/20 focus-visible:border-[#FF9B8A] transition-all placeholder:text-slate-300 ${formChange.formState.errors.newEmail ? "border-red-500 bg-red-50/30" : ""}`}
                        />
                        {formChange.formState.errors.newEmail && (
                            <p className="text-[10px] text-red-500 ml-4 mt-1 font-bold">{formChange.formState.errors.newEmail.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={changeEmail.isPending}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {changeEmail.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Tiếp tục <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </motion.form>
            ) : (
                <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={formVerify.handleSubmit(onVerify)}
                    className="space-y-8 text-center"
                >
                    <div className="space-y-4">
                        <div className="h-16 w-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-2 border border-emerald-100">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Xác thực Email</h3>
                        <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm">Mã OTP đã được gửi đến <span className="text-slate-900 font-bold">{newEmail}</span></p>
                    </div>

                    <div className="flex justify-center py-4">
                        <InputOTP
                            maxLength={6}
                            value={formVerify.watch("otp")}
                            onChange={(val) => formVerify.setValue("otp", val, { shouldValidate: true })}
                        >
                            <InputOTPGroup className="gap-2">
                                {[0, 1, 2].map((i) => (
                                    <InputOTPSlot key={i} index={i} className="w-11 h-13 border-slate-200 text-lg font-bold text-slate-900 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#FF9B8A]/20 focus:border-[#FF9B8A] transition-all" />
                                ))}
                            </InputOTPGroup>
                            <div className="mx-2 flex items-center text-slate-300">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                            <InputOTPGroup className="gap-2">
                                {[3, 4, 5].map((i) => (
                                    <InputOTPSlot key={i} index={i} className="w-11 h-13 border-slate-200 text-lg font-bold text-slate-900 rounded-xl bg-slate-50 focus:ring-2 focus:ring-[#FF9B8A]/20 focus:border-[#FF9B8A] transition-all" />
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {formVerify.formState.errors.otp && (
                        <p className="text-[11px] text-red-500 font-bold mt-2">{formVerify.formState.errors.otp.message}</p>
                    )}

                    <div className="space-y-4 pt-6">
                        <Button
                            type="submit"
                            disabled={verifyChangeEmail.isPending || formVerify.watch("otp").length !== 6}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                        >
                            {verifyChangeEmail.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Xác nhận thay đổi"
                            )}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Dùng email khác
                        </button>
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
    );
}
