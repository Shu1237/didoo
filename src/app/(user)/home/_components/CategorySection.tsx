"use client";

import { Category } from "@/types/event";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  if (!categories?.length) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
            Khám phá theo danh mục
          </h2>
          <p className="mt-2 text-zinc-500 text-sm">
            Chọn danh mục yêu thích để tìm sự kiện phù hợp
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
        >
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              <Link
                href={`/events?categoryId=${category.id}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-primary/5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-lg font-bold text-primary/80 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                  {category.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-zinc-700 group-hover:text-primary text-center line-clamp-2">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Xem tất cả sự kiện
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
