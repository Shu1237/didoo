'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
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
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

type FormValues = RegisterInput & { otp?: string; avatarUrl?: string };



export default function RegisterForm() {
  const maskStyle = {
    maskImage: 'radial-gradient(circle at top right, transparent 90px, black 50px)',
    WebkitMaskImage: 'radial-gradient(circle at top right, transparent 100px, black 101px)',
  };

  const { register, verifyRegister, loginGoogle } = useAuth();
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
      gender: 0,
      password: '',
      confirmPassword: '',
      otp: '',
      avatarUrl: 'string',
    },
    mode: 'onChange'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const currentOtp = watch("otp");
  const currentEmail = watch("email");
  const currentPassword = watch("password");

  const isPasswordSecure =
    currentPassword.length >= 8 &&
    /[A-Z]/.test(currentPassword) &&
    /[!@#$%^&*(),?":{}|<>]/.test(currentPassword);

  const onSubmit = async (data: FormValues) => {
    if (step === 1) {
      if (register.isPending) return;
      setError(null);
      try {
        await register.mutateAsync(data);
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
      <div className="p-6 lg:p-10 text-white max-h-[90vh] overflow-y-auto no-scrollbar">
        <Link href="/home" className="inline-block mb-4 hover:scale-105 transition-transform">
          <Image src="/DiDoo.png" alt="DiDoo logo" width={50} height={50} className="rounded-xl shadow-lg" priority />
        </Link>
        <h1 className="text-3xl font-bold mb-1">
          {step === 1 && 'Create Account'}
          {step === 2 && 'Verify Account'}
        </h1>
        <p className="text-white/40 text-base mb-4">
          {step === 1 && 'Join us and start exploring events'}
          {step === 2 && `An OTP has been sent to ${watch('email')}`}
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 text-red-200 text-xs rounded-xl text-center">
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
            className="space-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60 ml-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...registerField("fullName")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.fullName ? '!border-red-500 bg-red-500/10' : ''}`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-red-500 ml-2 mt-0.5 whitespace-pre-line leading-relaxed">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60 ml-2">Email</label>
                    <input
                      type="email"
                      placeholder="Johndoe@gmail.com"
                      {...registerField("email")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.email ? '!border-red-500 bg-red-500/10' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 ml-2 mt-0.5 whitespace-pre-line leading-relaxed">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60 ml-2">Gender</label>
                    <select
                      {...registerField("gender", { valueAsNumber: true })}
                      className="w-full bg-black/50 border border-transparent rounded-full px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all text-white appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                    >
                      <option value={0} className="bg-[#1A1A1A]">Male</option>
                      <option value={1} className="bg-[#1A1A1A]">Female</option>
                      <option value={2} className="bg-[#1A1A1A]">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-white/60 ml-2">Birth Date</label>
                    <input
                      type="date"
                      {...registerField("dateOfBirth")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white [color-scheme:dark] ${errors.dateOfBirth ? '!border-red-500 bg-red-500/10' : ''}`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-[10px] text-red-500 ml-2 mt-0.5 whitespace-pre-line leading-relaxed">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/60 ml-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerField("password")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.password ? '!border-red-500 bg-red-500/10' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-500 ml-2 mt-0.5 whitespace-pre-line leading-relaxed">{errors.password.message}</p>
                  )}
                  {/* Password Requirements */}
                  {currentPassword && (
                    <div className="mt-1 ml-2 space-y-0.5">
                      <span className={`text-[10px] flex items-center gap-1 ${currentPassword.length >= 8 ? 'text-green-400' : 'text-white/40'}`}>
                        <span className={`w-1 h-1 rounded-full inline-block flex-shrink-0 ${currentPassword.length >= 8 ? 'bg-green-400' : 'bg-white/40'}`} /> Min 8 characters
                      </span>
                      <span className={`text-[10px] flex items-center gap-1 ${/[A-Z]/.test(currentPassword) ? 'text-green-400' : 'text-white/40'}`}>
                        <span className={`w-1 h-1 rounded-full inline-block flex-shrink-0 ${/[A-Z]/.test(currentPassword) ? 'bg-green-400' : 'bg-white/40'}`} /> One uppercase letter
                      </span>
                      <span className={`text-[10px] flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(currentPassword) ? 'text-green-400' : 'text-white/40'}`}>
                        <span className={`w-1 h-1 rounded-full inline-block flex-shrink-0 ${/[!@#$%^&*(),.?":{}|<>]/.test(currentPassword) ? 'bg-green-400' : 'bg-white/40'}`} /> One special character
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/60 ml-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerField("confirmPassword")}
                      className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.confirmPassword ? '!border-red-500 bg-red-500/10' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-500 ml-2 mt-0.5 whitespace-pre-line leading-relaxed">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={register.isPending}
                  className="w-full h-12 mt-2 bg-[#FF9B8A] text-white font-bold rounded-full py-2 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="space-y-4">
                <div className="space-y-2 flex flex-col items-center">
                  <div className="flex justify-center py-2">
                    <InputOTP
                      maxLength={6}
                      value={currentOtp || ''}
                      onChange={(value) => setValue("otp", value, { shouldValidate: true })}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-10 h-10 text-base" />
                        <InputOTPSlot index={1} className="w-10 h-10 text-base" />
                        <InputOTPSlot index={2} className="w-10 h-10 text-base" />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} className="w-10 h-10 text-base" />
                        <InputOTPSlot index={4} className="w-10 h-10 text-base" />
                        <InputOTPSlot index={5} className="w-10 h-10 text-base" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors.otp && (
                    <p className="text-center text-[10px] text-red-500 whitespace-pre-line leading-relaxed">{errors.otp.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verifyRegister.isPending || (currentOtp?.length || 0) !== 6}
                  className="w-full h-12 bg-[#FF9B8A] text-white font-bold rounded-full py-2 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifyRegister.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <p className="text-center text-xs text-white/40">
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

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xs text-white/50 font-medium">Hoặc đăng ký với</p>
          <div className="w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center shadow-xl shadow-black/25 border border-zinc-200 ring-[3px] ring-zinc-100 ring-offset-[3px] ring-offset-[#2D2D2D]/80 hover:scale-105 hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (loginGoogle.isPending) return;
                const googleToken = credentialResponse.credential;
                if (!googleToken) {
                  setError("Không nhận được token từ Google");
                  return;
                }
                try {
                  await loginGoogle.mutateAsync({
                    GoogleToken: googleToken,
                    Location: { latitude: 0, longitude: 0 }
                  });
                } catch (err: any) {
                  handleErrorApi({ error: err });
                  setError(err?.message || "Đăng nhập Google thất bại.");
                }
              }}
              onError={() => {
                setError("Đăng nhập Google thất bại.");
                toast.error("Google Login failed");
              }}
              type="icon"
              shape="circle"
              theme="outline"
              size="large"
            />
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-4">
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
            <h2 className="text-[52px] font-bold text-white leading-[1.1]">Join our explorers</h2>
            <p className="text-xl text-white/60 font-light max-w-sm leading-relaxed">Discover and book your favorite events with ease. Start your journey with DiDoo today.</p>

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

function SocialIcon({ icon, onClick }: { icon: string, onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10"
    >
      {icon === 'google' && <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={22} height={22} alt="G" />}
    </button>
  );
}
