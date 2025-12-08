
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, SlidersHorizontal } from 'lucide-react';


const SearchFilter = () => {
    // Màu sắc #4A4A4A được sử dụng để mô phỏng màu xám đậm trong ảnh
    const greyClass = 'bg-[#4A4A4A] text-white'; 

    return (
     <>
        
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                
                {/* Tìm kiếm sự kiện */}
                <div className={`${greyClass} rounded-full px-4 py-2 flex items-center`}>
                    <Search className="w-4 h-4 mr-2" />
                    <span>Tìm kiếm sự kiện</span>
                </div>

                {/* Địa điểm */}
                <div className={`${greyClass} rounded-full px-4 py-2 flex items-center`}>
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Địa điểm</span>
                </div>

                {/* Ngày diễn ra sự kiện */}
                <div className={`${greyClass} rounded-full px-4 py-2 flex items-center`}>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Ngày diễn ra sự kiện</span>
                </div>
            </div>

            {/* Hàng 2: Input fields thực tế */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Input Search */}
                <Input 
                    type="text" 
                    placeholder="Search" 
                    className="h-10 border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
                />
                
                {/* Input Địa điểm */}
                <Input 
                    type="text" 
                    placeholder="Địa điểm" 
                    className="h-10 border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
                />
                
                {/* Input Ngày */}
                <Input 
                    type="text" 
                    placeholder="Ngày diễn ra" 
                    className="h-10 border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="h-4"></div> {/* Khoảng cách */}

            {/* Hàng 3: Nút Lọc và Tìm kiếm */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                
                {/* Nút Bộ lọc */}
                <Button 
                    variant="outline" // Giả định có variant outline
                    className="w-full col-span-1 md:col-span-2 h-10 rounded-full bg-[#4A4A4A] text-white hover:bg-gray-600"
                >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Bộ lọc
                </Button>

                {/* Nút Tìm kiếm (Màu Gradient) */}
                <Button 
                    className="w-full col-span-1 md:col-span-2 h-10 rounded-full text-white 
                                bg-linear-to-r from-purple-500 to-cyan-400 hover:opacity-90 transition-opacity"
                >
                    <Search className="w-4 h-4 mr-2" />
                    Tìm kiếm
                </Button>
            </div>
        </>
    );
};

export default SearchFilter;