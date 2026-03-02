'use client';

import { Category } from "@/types/category";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { Layers } from "lucide-react";

interface CategorySectionProps {
    categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    if (!categories || categories.length === 0) return null;

    return (
        <section className="pt-24 pb-16 bg-slate-50 relative z-20 -mt-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-primary font-black uppercase tracking-[0.2em] text-xs mb-2 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Explore
                    </span>
                    <h3 className="text-3xl font-black text-slate-900 uppercase">Browse Categories</h3>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {categories.map((category, idx) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.05, translateY: -4 }}
                            className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md hover:bg-white hover:border-primary/20 transition-all cursor-pointer group"
                        >
                            <span className="text-slate-600 group-hover:text-primary font-bold uppercase tracking-wider text-sm">
                                {category.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
