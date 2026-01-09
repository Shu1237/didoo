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
import { ArrowLeft, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgetPasswordForm() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

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
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            {step === 1 && <Mail className="w-6 h-6" />}
            {step === 2 && <CheckCircle2 className="w-6 h-6" />}
            {step === 3 && <Lock className="w-6 h-6" />}
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {step === 1 && 'Quên mật khẩu?'}
          {step === 2 && 'Xác thực OTP'}
          {step === 3 && 'Đặt lại mật khẩu'}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {step === 1 && 'Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại quyền truy cập.'}
          {step === 2 && `Mã xác thực đã được gửi đến ${email}`}
          {step === 3 && 'Tạo mật khẩu mới cho tài khoản của bạn.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/25">
                Gửi mã xác thực
              </Button>
            </div>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex justify-center py-4">
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

              <Button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full h-11 text-base shadow-lg shadow-primary/25"
              >
                Xác thực
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Chưa nhận được mã?{' '}
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline"
                  onClick={() => console.log('Resend OTP')}
                >
                  Gửi lại
                </button>
              </p>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mật khẩu mới</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-destructive font-medium">Mật khẩu không khớp</p>
              )}

              <Button
                type="submit"
                disabled={!password || password !== confirmPassword}
                className="w-full h-11 text-base shadow-lg shadow-primary/25"
              >
                Đặt lại mật khẩu
              </Button>
            </div>
          )}
        </motion.form>
      </AnimatePresence>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}   