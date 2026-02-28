'use client';

import { Organizer } from "@/types/organizer";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

interface TrendingEventsProps {
    organizers: Organizer[];
}

export const TrendingEvents = ({ organizers }: TrendingEventsProps) => {
    // If no organizers, don't show the section
    if (!organizers || organizers.length === 0) return null;

    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="space-y-4">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-sm">Mạng lưới của chúng tôi</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase leading-[0.9] tracking-tighter max-w-xl">
                            Featured <br />
                            Organizers
                        </h2>
                    </div>
                </div>

                <div className="w-full">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {organizers.map((organizer, idx) => (
                                <CarouselItem key={organizer.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                                    <div className="relative group p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                        {/* Image Container */}
                                        <div className="aspect-square relative overflow-hidden rounded-2xl bg-slate-50 mb-6 group-hover:shadow-lg transition-all border border-slate-100">
                                            <Image
                                                src={organizer.logoUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop'}
                                                alt={organizer.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />

                                            {/* Social Overlay */}
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                {organizer.facebookUrl && (
                                                    <Link href={organizer.facebookUrl} target="_blank">
                                                        <Button size="icon" variant="ghost" className="text-white hover:bg-white hover:text-primary rounded-full bg-white/20 backdrop-blur-md">
                                                            <Facebook className="w-5 h-5" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {organizer.instagramUrl && (
                                                    <Link href={organizer.instagramUrl} target="_blank">
                                                        <Button size="icon" variant="ghost" className="text-white hover:bg-white hover:text-primary rounded-full bg-white/20 backdrop-blur-md">
                                                            <Instagram className="w-5 h-5" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="text-center space-y-3">
                                            <h3 className="text-slate-900 font-black uppercase text-xl tracking-tight truncate leading-none">
                                                {organizer.name}
                                            </h3>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest line-clamp-2 min-h-[30px]">
                                                {organizer.description || "Đơn vị tổ chức sự kiện hàng đầu tại Việt Nam"}
                                            </p>

                                            <Link href={`/organizers/${organizer.id}`} className="block w-full">
                                                <Button variant="outline" className="h-12 w-full rounded-2xl border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary uppercase text-[10px] font-black tracking-widest transition-all duration-300">
                                                    Xem hồ sơ
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex justify-end gap-3 mt-10">
                            <CarouselPrevious className="static translate-y-0 h-14 w-14 border-slate-100 bg-white text-slate-900 hover:bg-primary hover:text-white hover:border-primary rounded-full transition-all shadow-sm shadow-slate-200 active:scale-95" />
                            <CarouselNext className="static translate-y-0 h-14 w-14 border-slate-100 bg-white text-slate-900 hover:bg-primary hover:text-white hover:border-primary rounded-full transition-all shadow-sm shadow-slate-200 active:scale-95" />
                        </div>
                    </Carousel>
                </div>

            </div>
        </section>
    );
};
