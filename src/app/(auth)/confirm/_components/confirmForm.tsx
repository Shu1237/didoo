'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { VerifyForgotPasswordInput, verifyForgotPasswordSchema } from '@/schemas/auth';
import { handleErrorApi } from '@/lib/errors';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ConfirmForm({ resetKey }: { resetKey?: string }) {
    const [success, setSuccess] = useState(false);
    const { verifyForgotPassword } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid },
    } = useForm<VerifyForgotPasswordInput>({
        resolver: zodResolver(verifyForgotPasswordSchema),
        defaultValues: {
            key: resetKey || '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (data: VerifyForgotPasswordInput) => {
        if (!resetKey) {
            toast.error("Invalid reset key. Please request a new link.");
            return;
        }

        try {
            await verifyForgotPassword.mutateAsync(data);
            setSuccess(true);
            toast.success("Password reset successfully!");

            // Auto redirect after 3 seconds
            setTimeout(() => {
                router.replace('/login?reset=success');
            }, 3000);
        } catch (error) {
            handleErrorApi({
                error,
                setError,
            });
        }
    };

    const maskStyle = {
        maskImage: 'radial-gradient(circle at top right, transparent 90px, black 50px)',
        WebkitMaskImage: 'radial-gradient(circle at top right, transparent 100px, black 101px)',
    };

    if (!resetKey) {
        return (
            <div className="text-center p-12 bg-[#2D2D2D]/60 backdrop-blur-3xl rounded-[40px] border border-white/10 max-w-md w-full">
                <div className="h-20 w-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                    <Lock className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
                <p className="text-white/40 mb-8">This link is missing a security key or has already been used. Please request a new one.</p>
                <Link href="/forgot-password" className="block w-full h-14 bg-[#FF9B8A] text-white font-bold rounded-full py-4 transition-all flex items-center justify-center shadow-lg shadow-[#FF9B8A]/20">
                    Request New Link
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 bg-[#2D2D2D]/60 backdrop-blur-[40px] rounded-[50px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden relative max-w-6xl w-full"
        >
            {/* LEFT SIDE: FORM */}
            <div className="p-8 lg:p-16 text-white overflow-y-auto no-scrollbar">
                <AnimatePresence mode="wait">
                    {!success ? (
                        <motion.div
                            key="form-confirm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="inline-block p-4 bg-[#FF9B8A]/10 rounded-2xl text-[#FF9B8A] mb-6">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h1 className="text-[40px] font-bold mb-3 leading-tight">Reset Password</h1>
                            <p className="text-white/40 text-lg mb-10">Set your new password below. Make sure it's strong and unique.</p>

                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                <input type="hidden" {...register("key")} />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...register("newPassword")}
                                            className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-500 text-white ${errors.newPassword ? '!border-red-500 bg-red-500/10' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <p className="text-xs text-red-500 ml-4 mt-1 font-medium">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/60 ml-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            {...register("confirmPassword")}
                                            className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-500 text-white ${errors.confirmPassword ? '!border-red-500 bg-red-500/10' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-xs text-red-500 ml-4 mt-1 font-medium">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={verifyForgotPassword.isPending || !isValid}
                                    className="w-full h-14 bg-[#FF9B8A] text-white font-bold rounded-full py-4 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg active:scale-[0.98] mt-4"
                                >
                                    {verifyForgotPassword.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-confirm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="mx-auto h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-8 border border-green-500/30">
                                <ShieldCheck className="w-12 h-12" />
                            </div>
                            <h2 className="text-[44px] font-bold mb-4">You're All Set!</h2>
                            <p className="text-white/40 text-lg mb-12 max-w-sm mx-auto">
                                Your password has been successfully reset. You can now log in with your new credentials.
                            </p>

                            <div className="space-y-4">
                                <Link href="/login" className="w-full h-14 bg-[#FF9B8A] text-white font-bold rounded-full py-4 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all flex items-center justify-center gap-2 text-lg">
                                    Log In Now <ArrowRight className="w-5 h-5" />
                                </Link>
                                <p className="text-white/20 text-sm">Redirecting to login in 3 seconds...</p>

                                <button
                                    onClick={() => window.close()}
                                    className="mt-6 text-white/40 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white/20"
                                >
                                    Close this tab
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* RIGHT SIDE: DECORATION */}
            <div className="hidden lg:block p-4 relative">
                <div
                    className="h-full bg-black rounded-[45px] p-16 flex flex-col justify-center relative shadow-2xl"
                    style={maskStyle}
                >
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-[52px] font-bold text-white leading-[1.1]">Everything looks good!</h2>
                        <p className="text-xl text-white/40 font-light max-w-sm leading-relaxed">
                            You're just one step away from getting back into your account and resuming your journey.
                        </p>
                    </div>

                    <div className="absolute top-10 right-10 opacity-10 pointer-events-none grayscale brightness-0 invert">
                        <Image src="/DiDoo.png" alt="logo" width={200} height={200} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}