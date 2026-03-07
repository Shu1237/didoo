"use client";

import { Category } from "@/types/category";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (!categories?.length) return null;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
            Khám phá theo danh mục
          </h2>
          <p className="mt-3 text-zinc-600 max-w-xl mx-auto">
            Chọn danh mục yêu thích để tìm sự kiện phù hợp
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
        >
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <Link
                href={`/events?categoryId=${category.id}`}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-primary/5 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-2xl font-bold text-primary/80 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  {category.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold text-zinc-800 group-hover:text-primary text-center line-clamp-2">
                  {category.name}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Xem sự kiện
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Xem tất cả sự kiện
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
