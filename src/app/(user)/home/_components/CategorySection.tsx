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
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title="Browse by Category"
                    subtitle="Find the perfect event for your interests"
                    icon={Layers}
                    variant="primary"
                />

                <div className="flex flex-wrap gap-4 mt-8">
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
