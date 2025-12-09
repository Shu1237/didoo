



'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation'

export default function ForgetPasswordForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 const router = useRouter()

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNextStep();
    } else {
      // Handle password reset
      console.log('Password reset completed');
      router.push('/login');

    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-blue-300/50 shadow-2xl p-8 md:p-12">
      {/* Back Button */}
      <Link
        href="/login"
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại đăng nhập
      </Link>

      {/* Logo */}
      <div className=' flex justify-center my-3 '>
        <Link href="/home" >
          <Image
            src="/DiDoo.png"
            alt="DiDoo logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-md"
            priority
          />
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
        Quên mật khẩu
      </h1>
      <p className="text-center text-sm text-gray-600 mb-8">
        {step === 1 && 'Nhập email để nhận mã xác thực'}
        {step === 2 && 'Nhập mã OTP đã được gửi đến email của bạn'}
        {step === 3 && 'Tạo mật khẩu mới cho tài khoản của bạn'}
      </p>




      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email hoặc số điện thoại"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-gray-400/30 border-none rounded-lg text-gray-800 placeholder:text-gray-600"
              required
            />
            <Button
              type="submit"
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg"
            >
              Gửi mã xác thực
            </Button>
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
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
            <p className="text-center text-sm text-gray-600">
              Không nhận được mã?{' '}
              <button
                type="button"
                className="text-blue-600 font-semibold hover:underline"
              >
                Gửi lại
              </button>
            </p>
            <Button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác thực
            </Button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-gray-400/30 border-none rounded-lg text-gray-800 placeholder:text-gray-600"
              required
            />
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 bg-gray-400/30 border-none rounded-lg text-gray-800 placeholder:text-gray-600"
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-red-600">Mật khẩu không khớp</p>
            )}
            <Button
              type="submit"
              disabled={!password || password !== confirmPassword}
              className="w-full h-12 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Đặt lại mật khẩu
            </Button>
          </div>
        )}
      </form>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500 mt-6">
        Bằng việc tiếp tục, bạn đã đọc và đồng ý với{' '}
        <Link href="/terms" className="text-cyan-600 hover:underline">
          Điều khoản sử dụng
        </Link>{' '}
        và{' '}
        <Link href="/privacy" className="text-cyan-600 hover:underline">
          Chính sách bảo mật
        </Link>{' '}
        của DiDoo.
      </p>
    </div>
  );
}   