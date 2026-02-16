'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Facebook } from 'lucide-react';

export default function RegisterForm() {
  const maskStyle = {
    maskImage: 'radial-gradient(circle at top right, transparent 90px, black 50px)',
    WebkitMaskImage: 'radial-gradient(circle at top right, transparent 100px, black 101px)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 lg:grid-cols-2 bg-[#2D2D2D]/60 backdrop-blur-[40px] rounded-[50px] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-visible relative"
    >
      {/* FORM BÊN TRÁI */}
      <div className="p-8 lg:p-16 text-white">
        <Link href="/home" className="inline-block mb-6 hover:scale-105 transition-transform">
          <Image src="/DiDoo.png" alt="DiDoo logo" width={60} height={60} className="rounded-xl shadow-lg" priority />
        </Link>
        <h1 className="text-[44px] font-bold mb-2">Create Account</h1>
        <p className="text-white/40 text-lg mb-6">Join us and start exploring events</p>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-2">Email or Phone Number</label>
            <Input className="h-14 bg-black/50 border-none rounded-full px-6 text-white" placeholder="Johndoe@gmail.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-2">Password</label>
            <Input type="password" className="h-14 bg-black/50 border-none rounded-full px-6 text-white" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60 ml-2">Confirm Password</label>
            <Input type="password" className="h-14 bg-black/50 border-none rounded-full px-6 text-white" placeholder="••••••••" />
          </div>
          <Button className="w-full h-12 bg-[#FF9B8A] hover:bg-[#FF8A75] text-white rounded-full text-base font-semibold shadow-lg shadow-[#FF9B8A]/20 transition-all">
            Sign Up
          </Button>
        </form>

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
