'use client';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailEventProps {
  data: {
    imageUrl: string;
    title: string;
    date: string;
    time: string;
    location: string;
    subLocation: string;
    price: string;
  };
}

export default function EventBanner({ data }: DetailEventProps) {
  return (
    <section className="w-full mt-[-100px] pt-[100px] z-0">
      <div className="mx-auto max-w-[90vw] md:max-w-[95vw] lg:max-w-[1400px] 
                  bg-[#0E7C7C] rounded-[40px] overflow-hidden p-6 md:p-10">

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-center">

          {/* LEFT — Banner image */}
          <div className="w-full lg:col-span-7">
            <div className="relative w-full h-[350px] md:h-[480px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-fit"
                priority
              />
            </div>
          </div>

          {/* RIGHT — Event info */}
          <div className="text-white space-y-6 lg:col-span-3">

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {data.title}
            </h1>

            <div className="flex items-center gap-3 text-lg">
              <Calendar className="w-5 h-5" />
              <span>{data.time}, {data.date}</span>
            </div>

            <div className="flex items-center gap-3 text-lg">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="font-semibold">{data.location}</p>
                <p className="text-sm opacity-80">{data.subLocation}</p>
              </div>
            </div>

            <div className="text-2xl font-bold text-[#E5C3FF]">
              {data.price}
            </div>

            <Button
              className="w-full h-12 font-semibold text-lg bg-linear-to-r from-purple-500 via-purple-400 to-cyan-400"
            >
              Đăng nhập để mua vé
            </Button>

          </div>

        </div>
      </div>
    </section>

  );
}
