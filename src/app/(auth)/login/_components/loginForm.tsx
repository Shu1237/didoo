'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { handleErrorApi } from '@/lib/errors';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';


export default function LoginForm() {
  const maskStyle = {
    maskImage: 'radial-gradient(circle at top right, transparent 90px, black 50px)',
    WebkitMaskImage: 'radial-gradient(circle at top right, transparent 100px, black 101px)',
  };

  const { login, loginGoogle } = useAuth();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError: setErrorForm,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      location: {
        latitude: 0,
        longitude: 0,
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (errorGeolocation) => {
          console.warn("Location access denied or unavailable, using default 0,0:", errorGeolocation);
          setValue("location", { latitude: 0, longitude: 0 });
        }
      );
    }
  }, [setValue]);

  const onSubmit = async (data: LoginInput) => {
    if (login.isPending) return;
    setError(null);
    try {
      await login.mutateAsync(data);
    } catch (err: any) {
      handleErrorApi({
        error: err,
        setError: setErrorForm
      });
      setError(err?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    if (loginGoogle.isPending) return;
    setError(null);
    try {
      await loginGoogle.mutateAsync({
        googleToken: credentialResponse.credential,
        location: watch("location")
      });
    } catch (err: any) {
      handleErrorApi({ error: err });
      setError(err?.message || "Đăng nhập Google thất bại.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 bg-[#2D2D2D]/60 backdrop-blur-[40px] rounded-[50px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-visible relative"
    >
      {/* FORM BÊN TRÁI */}
      <div className="p-6 lg:p-10 text-white">
        <Link href="/home" className="inline-block mb-4 hover:scale-105 transition-transform">
          <Image src="/DiDoo.png" alt="DiDoo logo" width={50} height={50} className="rounded-xl shadow-lg" priority />
        </Link>
        <h1 className="text-3xl font-bold mb-1">Welcome back</h1>
        <p className="text-white/40 text-base mb-4">Please Enter your Account details</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {resetSuccess && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-200 text-sm rounded-xl text-center">
            Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập lại.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60 ml-2">Email</label>
            <input
              type="email"
              placeholder="Johndoe@gmail.com"
              {...register("email")}
              className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all placeholder:text-gray-400 text-white ${errors.email ? '!border-red-500 bg-red-500/10' : ''}`}
            />
            {errors.email && (
              <p className="text-[10px] text-red-500 ml-2 mt-0.5 whitespace-pre-line leading-relaxed">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60 ml-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
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
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-2 text-white/40 text-sm">
              <Checkbox id="rem" className="border-white/20 data-[state=checked]:bg-[#FF9B8A]" />
              <label htmlFor="rem">Keep me loged in</label>
            </div>
            <Link href="/forgot-password" className="text-sm text-white/40 underline underline-offset-4 decoration-white/20">Forgot Password</Link>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full h-12 bg-[#FF9B8A] text-white font-bold rounded-full py-2 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {login.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                setError("Đăng nhập Google thất bại.");
                toast.error("Google Login failed");
              }}
              type="icon"
              shape="circle"
              theme="outline"
            />
          </div>
        </div>
        <p className="text-center text-xs text-white/40 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#FF9B8A] font-bold hover:underline">
            Sign up
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
