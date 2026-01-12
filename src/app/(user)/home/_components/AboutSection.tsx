'use client';

import { features } from "@/utils/mock";
import { motion } from "framer-motion";
import { ShieldCheck, Star, TrendingUp } from "lucide-react";





export function AboutSection() {
    return (
        <section className="relative py-24 px-4 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left: Sticky Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 lg:sticky lg:top-24 space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-sm">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold tracking-wide uppercase text-muted-foreground">Premium Experience</span>
                        </div>

                        <h2 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
                            Redefining <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent animate-gradient-x">
                                Live Events.
                            </span>
                        </h2>

                        <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                            Didoo isn't just a platform; it's your passport to the world's most exciting happenings. From intimate workshops to stadium-filling concerts, we bring the world to your fingertips.
                        </p>

                        <div className="flex items-center gap-6 pt-4">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-muted overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-2 border-background bg-primary text-white flex items-center justify-center font-bold text-xs">
                                    +10k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">Trusted by</span>
                                <span className="text-sm text-muted-foreground">10,000+ Organizers</span>
                            </div>
                        </div>

                        <div className="pt-8 grid grid-cols-2 gap-8 border-t border-border/50">
                            <div>
                                <h4 className="text-4xl font-black text-foreground">500+</h4>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Daily Events</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-black text-foreground">98%</h4>
                                <p className="text-sm font-medium text-muted-foreground mt-1">Satisfaction Rate</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Bento Grid */}
                    <div className="lg:w-1/2 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Large Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-[2rem] border border-primary/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-all duration-500" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Trending & Hot</h3>
                                <p className="text-muted-foreground">Our AI-driven algorithm surfaces the events you'll love before they sell out. Never miss a beat.</p>
                            </div>
                        </motion.div>

                        {/* Small Cards */}
                        {features.slice(0, 2).map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="bg-card/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </motion.div>
                        ))}

                        {/* Large Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="col-span-1 md:col-span-2 bg-gradient-to-br from-secondary/10 to-transparent p-8 rounded-[2rem] border border-secondary/20 relative overflow-hidden group"
                        >
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl -ml-16 -mb-16 group-hover:bg-secondary/30 transition-all duration-500" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30 shrink-0 group-hover:rotate-12 transition-transform duration-300">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">Safety First</h3>
                                    <p className="text-muted-foreground">We verify every organizer to ensure you get exactly what you paid for.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}