'use client';

import { Suspense } from "react";
import Loading from "@/components/loading";
import TicketsList from "./_components/TicketsList";
import { motion } from "framer-motion";

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            My <span className="text-gradient">Tickets</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your upcoming events and view your purchase history.
          </p>
        </motion.div>

        <Suspense fallback={<Loading />}>
          <TicketsList />
        </Suspense>
      </div>
    </div>
  );
}
