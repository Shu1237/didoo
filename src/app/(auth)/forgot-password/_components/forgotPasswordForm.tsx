'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, ArrowLeft, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { ForgotPasswordInput, forgotPasswordSchema } from '@/schemas/auth';
import { handleErrorApi } from '@/lib/errors';
import { toast } from 'sonner';

export default function ForgotPasswordForm() {
    const [step, setStep] = useState(1);
    const { forgotPassword } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onChange',
    });

    const email = watch('email');

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            await forgotPassword.mutateAsync({
                ...data,
                clientUri: `${window.location.origin}/confirm`
            });
            setStep(2);
            toast.success("Reset link sent successfully");
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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 bg-[#2D2D2D]/60 backdrop-blur-[40px] rounded-[50px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden relative max-w-6xl w-full"
        >
            {/* LEFT SIDE: FORM */}
            <div className="p-8 lg:p-16 text-white overflow-y-auto no-scrollbar">
                <Link href="/login" className="inline-flex items-center text-white/40 hover:text-white transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-[#FF9B8A]/10 rounded-2xl flex items-center justify-center text-[#FF9B8A] shadow-inner">
                        {step === 1 ? <Mail className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                    </div>
                </div>

                <h1 className="text-[40px] font-bold mb-3 leading-tight text-center">
                    {step === 1 ? 'Forgot Password?' : 'Check Your Email'}
                </h1>
                <p className="text-white/40 text-lg mb-10 text-center max-w-sm mx-auto">
                    {step === 1
                        ? "Enter your email and we'll send you a link to reset your password."
                        : `We've sent a password reset link to ${email}`}
                </p>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/60 ml-2">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="johndoe@gmail.com"
                                        {...register("email")}
                                        className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-500 text-white ${errors.email ? '!border-red-500 bg-red-500/10' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-500 ml-4 mt-1 font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={forgotPassword.isPending || !isValid}
                                className="w-full h-14 bg-[#FF9B8A] text-white font-bold rounded-full py-4 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
                            >
                                {forgotPassword.isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-8"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Please check your inbox and click the reset link. The link will expire in 15-30 minutes.
                                    If you don't see it, check your spam folder.
                                </p>
                            </div>

                            <button
                                onClick={() => setStep(1)}
                                className="text-[#FF9B8A] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer block mx-auto"
                            >
                                Didn't receive the email? Try again
                            </button>

                            <Link href="/login" className="block w-full h-14 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full py-4 transition-all flex items-center justify-center border border-white/10">
                                Return to Login
                            </Link>
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
                        <div className="inline-block p-3 bg-white/5 rounded-2xl backdrop-blur-md mb-4 border border-white/10">
                            <Lock className="w-8 h-8 text-[#FF9B8A]" />
                        </div>
                        <h2 className="text-[52px] font-bold text-white leading-[1.1]">Security is our priority.</h2>
                        <p className="text-xl text-white/40 font-light max-w-sm leading-relaxed">
                            We use advanced encryption to ensure your data stays safe while you explore the best events around.
                        </p>
                    </div>

                    <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
                        <Image src="/DiDoo.png" alt="logo" width={200} height={200} className="grayscale brightness-0 invert" />
                    </div>

                    <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
                        <svg width="200" height="200" viewBox="0 0 100 100" fill="none" className="text-[#FF9B8A]">
                            <path d="M50 0L53 47L100 50L53 53L50 100L47 53L0 50L47 47L50 0Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}