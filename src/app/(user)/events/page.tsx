'use client';

import { nowShowingEvents } from "@/utils/mock";
import SearchFilter from "../home/_components/SearchFilter";
import ListEvent from "./_components/ListEvent";
import { motion } from "framer-motion";

export default function EventsPage() {
    const eventNowShowing = nowShowingEvents;

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
                        Discover <span className="text-gradient">Events</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore the latest concerts, workshops, and gatherings happening around you.
                    </p>
                </motion.div>

                {/* Search Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-card p-4 md:p-8 rounded-3xl shadow-xl border border-border/50 max-w-5xl mx-auto mb-16 backdrop-blur-sm"
                >
                    <SearchFilter />
                </motion.div>

                {/* Events List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <ListEvent title="Happening Now" eventData={eventNowShowing} />
                </motion.div>
            </div>
        </div>
    )
}
