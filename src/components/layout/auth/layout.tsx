'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LayoutAuthProps {
  children: React.ReactNode;
}

export default function LayoutAuth({ children }: LayoutAuthProps) {
  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden relative">

      {/* Left Panel - Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-900 items-center justify-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-[url('/event1.jpg')] bg-cover bg-center opacity-30 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-black/80 to-blue-900/80" />

        {/* Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative z-10 p-12 text-white max-w-lg"
        >
          <div className="flex items-center gap-2 mb-6 text-purple-300">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold tracking-wider uppercase text-sm">Welcome to DiDoo</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Extraordinary</span>
          </h1>
          <p className="text-lg text-white/70 leading-relaxed">
            Join our community to explore events, connect with like-minded people, and create unforgettable memories.
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-background">
        {/* Mobile Background Decoration */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-purple-900/20 via-background to-background -z-10" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[480px]"
        >
          {children}
        </motion.div>
      </div>

    </div>
  );
}
