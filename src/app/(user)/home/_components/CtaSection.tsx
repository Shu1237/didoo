'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CtaSection() {
  return (
    <section className="pt-32 pb-0 w-full bg-[#0a0a0a]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-zinc-900 border-y border-zinc-800 w-full pt-32 pb-16 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none" />

        <h2 className="text-4xl sm:text-6xl md:text-[5vw] italic text-white leading-tight mb-8" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)", fontFamily: "var(--font-playfair), serif" }}>
          SỞ HỮU VÉ
          <br />NGAY BÂY GIỜ
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto text-lg mb-12 font-light tracking-wide italic">
          Đừng bỏ lỡ trải nghiệm K-pop đỉnh cao nhất. Đặt chỗ ngay trước khi cháy vé!
        </p>
        
        {/* Removed the SVG div as per the instruction's implied replacement */}

        <Link href="/events">
          <Button className="font-bold rounded-none bg-white text-black hover:bg-zinc-200 px-12 py-8 text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
            Mua Vé Ngay
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
