'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Eye, EyeOff, Mail, CheckCircle2 } from 'lucide-react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import * as z from 'zod';

import { RegisterInput, registerSchema } from '@/schemas/auth';
import { useState } from 'react';
import { handleErrorApi } from '@/lib/errors';

type FormValues = RegisterInput & { otp?: string };



export default function RegisterForm() {
  const maskStyle = {
    maskImage: 'radial-gradient(circle at top right, transparent 90px, black 50px)',
    WebkitMaskImage: 'radial-gradient(circle at top right, transparent 100px, black 101px)',
  };

  const { register, verifyRegister } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const {
    register: registerField,
    handleSubmit,
    setValue,
    watch,
    setError: setErrorForm,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      otp: '',
    },
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentOtp = watch("otp");
  const currentEmail = watch("email");

  const onSubmit = async (data: FormValues) => {
    if (step === 1) {
      if (register.isPending) return;
      setError(null);
      try {
        const { confirmPassword, otp, ...rest } = data;
        await register.mutateAsync({
          ...rest,
          gender: 0,
        });
        setStep(2);
      } catch (err: any) {
        console.log(err);
        handleErrorApi({
          error: err,
          setError: setErrorForm
        });
        setError(err?.message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } else if (step === 2) {
      if (verifyRegister.isPending) return;
      setError(null);
      const submitOtp = currentOtp;
      const submitEmail = currentEmail || data.email;
      if (submitOtp && submitOtp.length === 6) {
        try {
          await verifyRegister.mutateAsync({
            email: submitEmail,
            otp: submitOtp,
          });
          // Redirect to login will be handled by onSuccess in useAuth
        } catch (err: any) {
          handleErrorApi({
            error: err,
            setError: setErrorForm
          });
          setError(err?.message || "Xác thực thất bại.");
        }
      } else {
        setErrorForm("otp", { message: "Vui lòng nhập đủ 6 số OTP" });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 bg-[#2D2D2D]/60 backdrop-blur-[40px] rounded-[50px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-visible relative"
    >
      {/* FORM BÊN TRÁI */}
      <div className="p-8 lg:p-16 text-white max-h-[90vh] overflow-y-auto no-scrollbar">
        <Link href="/home" className="inline-block mb-6 hover:scale-105 transition-transform">
          <Image src="/DiDoo.png" alt="DiDoo logo" width={60} height={60} className="rounded-xl shadow-lg" priority />
        </Link>
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-[#FF9B8A]/10 rounded-xl flex items-center justify-center text-[#FF9B8A]">
            {step === 1 && <Mail className="w-6 h-6" />}
            {step === 2 && <CheckCircle2 className="w-6 h-6" />}
          </div>
        </div>
        <h1 className="text-[44px] font-bold mb-2">
          {step === 1 && 'Create Account'}
          {step === 2 && 'Verify Account'}
        </h1>
        <p className="text-white/40 text-lg mb-6">
          {step === 1 && 'Join us and start exploring events'}
          {step === 2 && `An OTP has been sent to ${watch('email')}`}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.form
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    {...registerField("fullName")}
                    className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.fullName ? '!border-red-500 bg-red-500/10' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 ml-2 mt-1 whitespace-pre-line leading-relaxed">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-2">Email</label>
                  <input
                    type="email"
                    placeholder="Johndoe@gmail.com"
                    {...registerField("email")}
                    className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.email ? '!border-red-500 bg-red-500/10' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 ml-2 mt-1 whitespace-pre-line leading-relaxed">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-2">Date of Birth</label>
                  <input
                    type="date"
                    {...registerField("dateOfBirth")}
                    className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white [color-scheme:dark] ${errors.dateOfBirth ? '!border-red-500 bg-red-500/10' : ''}`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-500 ml-2 mt-1 whitespace-pre-line leading-relaxed">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerField("password")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.password ? '!border-red-500 bg-red-500/10' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 ml-2 mt-1 whitespace-pre-line leading-relaxed">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 ml-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerField("confirmPassword")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-6 py-4 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.confirmPassword ? '!border-red-500 bg-red-500/10' : ''}`}
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
                    <p className="text-xs text-red-500 ml-2 mt-1 whitespace-pre-line leading-relaxed">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={register.isPending || (step === 1 && !isValid)}
                  className="w-full h-14 mt-4 bg-[#FF9B8A] text-white font-bold rounded-full py-4 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {register.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2 flex flex-col items-center">
                  <div className="flex justify-center py-4">
                    <InputOTP
                      maxLength={6}
                      value={currentOtp || ''}
                      onChange={(value) => setValue("otp", value, { shouldValidate: true })}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors.otp && (
                    <p className="text-center text-xs text-red-500 whitespace-pre-line leading-relaxed">{errors.otp.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifyRegister.isPending || (currentOtp?.length || 0) !== 6}
                  className="w-full h-14 bg-[#FF9B8A] text-white font-bold rounded-full py-4 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifyRegister.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <p className="text-center text-sm text-white/40">
                  Didn&apos;t receive code?{' '}
                  <button
                    type="button"
                    disabled={register.isPending}
                    className="text-[#FF9B8A] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => {
                      const { confirmPassword, otp, ...rest } = watch() as any;
                      register.mutate({ ...rest, gender: 0 });
                    }}
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}
          </motion.form>
        </AnimatePresence>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex justify-center gap-5">
            <SocialIcon icon="google" />
            <SocialIcon icon="facebook" />
          </div>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#FF9B8A] font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* KHỐI ĐEN VÀ VẾT CẮT (RIGHT SIDE) */}
      <div className="hidden lg:block p-4 relative">
        <div
          className="h-full bg-black rounded-[45px] p-16 pt-12 pb-24 flex flex-col justify-center relative"
          style={maskStyle}
        >
          <div className="relative z-10 space-y-10">
            <h2 className="text-[52px] font-bold text-white leading-[1.1]">What our explorers said</h2>
            <div className="text-4xl text-white/20 font-serif italic">&quot;</div>
            <p className="text-xl text-white/60 italic font-light max-w-sm leading-relaxed">Search and find your favorite events is now easier than ever. Just browse events and book tickets when you need to.</p>

          </div>

          <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none" className="text-blue-400">
              <path d="M50 0L53 47L100 50L53 53L50 100L47 53L0 50L47 47L50 0Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-[-40px] left-[100px] w-[400px] z-30 drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)]"
        >
          <div
            className="bg-white/90 backdrop-blur-md p-10 rounded-[55px] relative"
            style={maskStyle}
          >
            <div className="relative z-10">
              <h4 className="text-black font-bold text-[24px] mb-3 leading-tight pr-14">Find your perfect event and book now</h4>
              <p className="text-gray-500 text-base mb-8 leading-relaxed">Be among thousands of explorers discovering amazing events near you.</p>
              <div className="flex items-center -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-11 h-11 rounded-full border-[4px] border-white bg-gray-200 overflow-hidden">
                    <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" width={44} height={44} />
                  </div>
                ))}
                <div className="w-11 h-11 rounded-full bg-black text-white text-[10px] flex items-center justify-center border-[4px] border-white font-bold">+2</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  return (
    <button type="button" className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10">
      {icon === 'google' && <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={28} height={28} alt="G" />}
    </button>
  );
}
