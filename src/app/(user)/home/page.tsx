'use client';


import HeroSection from "./_components/HeroSection";
import ListEvent from "./_components/ListEvent";
import MapEvent from "./_components/MapEvent";
import { motion } from "framer-motion";
import SearchFilter from "./_components/SearchFilter";
import { EVENTS } from "@/utils/mock";


export default function Home() {
  // Filter events for different sections
  const upcomingEvents = EVENTS;
  const popularEvents = [...EVENTS].reverse(); 

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-card mt-5 p-4 md:p-8 rounded-3xl shadow-xl border border-border/50 max-w-5xl mx-auto mb-16 backdrop-blur-sm"
      >
        <SearchFilter />
      </motion.div>

      <div className="space-y-8 mt-12">
        <MapEvent eventData={upcomingEvents} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ListEvent title="Upcoming Events" eventData={upcomingEvents} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ListEvent title="Popular Now" eventData={popularEvents} />
        </motion.div>
      </div>
    </div>
  );
}