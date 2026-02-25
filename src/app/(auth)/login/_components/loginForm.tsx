'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/contexts/authContext';
import { GoogleLogin } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { handleErrorApi } from '@/lib/errors';
import { toast } from 'sonner';
// Sử dụng GoogleLogin để lấy ID Token (JWT) chuẩn xác

export default function LoginForm() {
  const maskStyle = {
    maskImage: 'radial-gradient(circle at top right, transparent 90px, black 50px)',
    WebkitMaskImage: 'radial-gradient(circle at top right, transparent 100px, black 101px)',
  };

  const { login, loginGoogle } = useAuth();
  const { setTokenFromContext } = useAuthContext();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError: setErrorForm,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      location: { latitude: 0, longitude: 0, address: '' }
    },
  });

  // Lấy vị trí người dùng khi component load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: '',
          });
        },
        () => setValue("location", { latitude: 0, longitude: 0, address: '' })
      );
    }
  }, [setValue]);

  // Submit đăng nhập Email/Password
  const onSubmit = async (data: LoginInput) => {
    if (login.isPending) return;
    setError(null);
    try {
      await login.mutateAsync(data);
    } catch (err: any) {
      handleErrorApi({ error: err, setError: setErrorForm });
      setError(err?.message || "Đăng nhập thất bại.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 bg-[#2D2D2D]/60 backdrop-blur-[40px] rounded-[50px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-visible relative"
    >
      {/* SECTION BÊN TRÁI: FORM ĐĂNG NHẬP */}
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

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60 ml-2">Email</label>
            <input
              type="email"
              placeholder="Johndoe@gmail.com"
              {...register("email")}
              className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all ${errors.email ? 'border-red-500 bg-red-500/10' : ''}`}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-white/60 ml-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full bg-black/50 border border-transparent rounded-full px-5 py-3 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF9B8A]/20 transition-all ${errors.password ? 'border-red-500 bg-red-500/10' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-white/40 hover:text-white transition-colors">Forgot password?</Link>
          </div>
          <button
            type="submit"
            disabled={login.isPending}
            className="w-full h-12 bg-[#FF9B8A] text-white font-bold rounded-full py-2 shadow-lg shadow-[#FF9B8A]/20 hover:bg-[#FF8A75] transition-all disabled:opacity-70 flex items-center justify-center"
          >
            {login.isPending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Sign in"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex justify-center items-center gap-5">
            <div className="bg-white rounded-full overflow-hidden w-14 h-14 flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-black/10">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (loginGoogle.isPending) return;
                  const googleToken = credentialResponse.credential;
                  if (!googleToken) {
                    toast.error("Không nhận được token từ Google");
                    return;
                  }
                  try {
                    const result = await loginGoogle.mutateAsync({
                      GoogleToken: googleToken,
                      Location: getValues('location')
                    });
                    if (result?.accessToken && result?.refreshToken) {
                      setTokenFromContext(result.accessToken, result.refreshToken);
                    }
                  } catch (err: any) {
                    console.error("Login BE error:", err);
                  }
                }}
                onError={() => {
                  toast.error("Đăng nhập Google thất bại");
                }}
                type="icon"
                shape="circle"
                theme="outline"
              />
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#FF9B8A] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* SECTION BÊN PHẢI: DECORATION */}
      <div className="hidden lg:block p-4 relative">
        <div
          className="h-full bg-black rounded-[45px] p-16 pt-12 pb-24 flex flex-col justify-center relative"
          style={maskStyle}
        >
          <div className="relative z-10 space-y-10">
            <h2 className="text-[52px] font-bold text-white leading-[1.1]">Join our explorers</h2>
            <p className="text-xl text-white/60 font-light max-w-sm leading-relaxed">
              Discover and book your favorite events with ease. Start your journey with DiDoo today.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SocialIcon({
  icon,
  onClick,
  disabled,
  loading
}: {
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF9B8A] rounded-full animate-spin"></div>
      ) : (
        <>
          {icon === 'google' && <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={28} height={28} alt="G" />}
          {/* {icon === 'facebook' && <Facebook className="w-7 h-7 text-[#1877F2] fill-current" />} */}
        </>
      )}
    </button>
  );
}
