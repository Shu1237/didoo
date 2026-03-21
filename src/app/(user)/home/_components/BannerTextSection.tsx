'use client';

import { motion } from 'framer-motion';

export default function BannerTextSection() {
  const textLines = [
    "DIDOO - NỀN TẢNG ĐẶT VÉ SỰ KIỆN",
    "HÀNG ĐẦU, KẾT NỐI BẠN VỚI NHỮNG",
    "TRẢI NGHIỆM GIẢI TRÍ ĐỈNH CAO TỪ CÁC",
    "ĐÊM NHẠC LỚN ĐẾN NHỮNG LỄ HỘI",
    "QUY MÔ NHẤT TOÀN QUỐC"
  ];

  return (
    <section className="py-24 md:py-40 w-full relative overflow-hidden bg-zinc-50 flex items-center justify-center min-h-[60vh]">
      {/* Subtle wavy pattern substitute (very faint radial gradient) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-200/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full mx-auto px-4 md:px-8 lg:px-16 flex flex-col items-center justify-center text-center relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } }
          }}
          className="flex flex-col gap-1 md:gap-2 w-full items-center"
        >
          {textLines.map((line, index) => (
            <motion.h2 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 60 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] xl:text-[80px] font-serif text-center italic text-zinc-900 leading-[1.2] drop-shadow-sm w-full mx-auto"
              style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
            >
              {line}
            </motion.h2>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
