import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Search, MapPin, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { vi } from 'date-fns/locale';

export const SearchFilter = () => {
    const [date, setDate] = useState<Date>();

    return (
        <div className="relative z-30 max-w-5xl mx-auto px-4 -mt-24 sm:-mt-10">
            <div className="bg-[#1e1b4b]/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-[2.5rem] p-3">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* Event Name Input */}
                    <div className="md:col-span-4 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search events, artists..."
                            className="flex h-14 w-full pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="md:col-span-3 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Location"
                            className="flex h-14 w-full pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 focus:bg-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                        />
                    </div>

                    {/* Date Picker - Đã đồng bộ class */}
                    <div className="md:col-span-3 relative group">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-14 pl-12 justify-start text-left font-normal rounded-xl",
                                        "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:text-white",
                                        "focus:ring-1 focus:ring-primary/20 transition-all",
                                        !date && "text-gray-400"
                                    )}
                                >
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <CalendarIcon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                    </div>
                                    {date ? format(date, "dd/MM/yyyy") : <span>Select Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-border/50" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={vi}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Search Button */}
                    <div className="md:col-span-2">
                        <Button className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all bg-primary hover:bg-primary/90 text-white">
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;