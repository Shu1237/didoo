"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import TicketsList from "./_components/TicketsList";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

export default function TicketsPage() {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4 ring-1 ring-primary/20">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Vé của <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">tôi</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            Quản lý các sự kiện sắp tới và xem lại lịch sử đặt vé của bạn.
          </p>
        </motion.div>

        <Suspense fallback={<Loading />}>
          <div className="animate-slide-up [animation-delay:0.2s]">
            <TicketsList />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
