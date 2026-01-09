'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, SlidersHorizontal } from 'lucide-react';

const SearchFilter = () => {
    return (
        <div className="max-w-6xl mx-auto px-2  rounded-3xl">
            {/* Row 1: Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Tìm kiếm sự kiện */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10" />
                    <Input
                        placeholder="Tìm kiếm sự kiện"
                        type='text'
                        className='h-12 pl-12 pr-4 rounded-full bg-[#333333] text-white placeholder:text-gray-300 border-none focus:ring-2 focus:ring-purple-500'
                    />
                </div>

                {/* Địa điểm */}
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10" />
                    <Input
                        placeholder="Địa điểm"
                        type='text'
                        className='h-12 pl-12 pr-4 rounded-full bg-[#333333] text-white placeholder:text-gray-300 border-none focus:ring-2 focus:ring-purple-500'
                    />
                </div>

                {/* Ngày diễn ra sự kiện */}
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-10" />
                    <Input
                        placeholder="Ngày diễn ra sự kiện"
                        type='date'
                        className='h-12 pl-12 pr-4 rounded-full bg-[#333333] text-white placeholder:text-gray-300 border-none focus:ring-2 focus:ring-purple-500'
                    />
                </div>
            </div>

            {/* Row 2: Bộ lọc và Tìm kiếm buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Nút Bộ lọc */}
                <Button
                    variant="outline"
                    className="h-12 bg-[#000000] text-white border-none rounded-full hover:bg-[#1A1A1A] transition-colors font-medium"
                >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Bộ lọc
                </Button>

                {/* Nút Tìm kiếm (Gradient) */}
                <Button
                    className="h-12 bg-linear-to-r from-purple-500 via-purple-400 to-cyan-400 text-white border-none rounded-full hover:opacity-90 transition-opacity font-medium shadow-lg"
                >
                    <Search className="w-5 h-5 mr-2" />
                    Tìm kiếm
                </Button>
            </div>
        </div>
    );
};

export default SearchFilter;