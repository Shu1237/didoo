'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import SearchFilter from './SearchFilter';

interface HeroSectionProps {
    ImageData: {
        id: number;
        imageUrl: string;
        title: string;
    }[];
}

export default function HeroSection({ ImageData }: HeroSectionProps) {
    const plugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: false,
            stopOnMouseEnter: true
        })
    );
    return (
        <section className=" w-full  mt-[-100px] pt-[100px] z-0">
            <div className="mx-auto max-w-[90vw] md:max-w-[95vw] lg:max-w-[1400px]  relative rounded-[40px] overflow-hidden ">
                <Carousel
                    plugins={[plugin.current]}
                    className="relative rounded-[40px] overflow-hidden shadow-2xl"
                    opts={{
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {ImageData.map((image) => (
                            <CarouselItem key={image.id}>
                                <div className="relative w-full min-h-[600px]">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.title}
                                        fill
                                        priority
                                        className="object-cover object-top brightness-[1] "
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 border-none">
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </CarouselPrevious>
                    <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 border-none">
                        <ChevronRight className="w-6 h-6 text-white" />
                    </CarouselNext>

                    {/* Text overlay */}
                    {/* <div className="absolute inset-0 z-10 p-8 md:p-16 lg:p-20 text-white flex flex-col justify-end pointer-events-none">
                        <div className="max-w-xl pb-10 pointer-events-auto">
                            <p className="text-xl font-serif mb-2">PRESENTED BY VIBES</p>
                            <h1 className="text-7xl lg:text-[8rem] font-black leading-none font-display mb-4">
                                Übermensch
                            </h1>
                            <h2 className="text-3xl font-semibold tracking-wider mb-8">
                                G-DRAGON 2025 WORLD TOUR IN HANOI
                            </h2>
                            <p className="text-lg font-medium tracking-wide">
                                NOV.08 SAT 2025 8WONDER OCEAN CITY
                            </p>
                            <p className="text-sm mt-1">
                                PRESALE OPEN OCT.07 | PUBLIC ON SALE OCT.09
                            </p>
                        </div>
                    </div> */}
                </Carousel>

                
             
            </div>
        </section>
    );
}