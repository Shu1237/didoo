'use client';

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  category: string | null;
  setCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'date' | 'distance' | 'price';
  setSortBy: (sort: 'date' | 'distance' | 'price') => void;
}

const Header = ({ category, setCategory, searchQuery, setSearchQuery, sortBy, setSortBy }: HeaderProps) => {
  const eventTypes = [
    { label: 'Tất cả', value: null },
    { label: 'Workshop', value: 'workshop' },
    { label: 'Hội thảo', value: 'hội thảo' },
    { label: 'Triển lãm', value: 'triển lãm' },
    { label: 'Hòa nhạc', value: 'hòa nhạc' },
  ];

  const sortOptions = [
    { label: 'Ngày diễn ra', value: 'date' as const },
    { label: 'Khoảng cách', value: 'distance' as const },
    { label: 'Giá vé', value: 'price' as const },
  ];

  return (
    <div className="p-4 bg-linear-to-br from-card/95 via-primary/5 to-card/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-primary/20 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm sự kiện..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-6 text-base"
        />
      </div>

      {/* Filter and Sort */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {/* Event Type Filter */}
        {eventTypes.map((item) => (
          <button
            key={item.label}
            onClick={() => setCategory(item.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
              transition-colors duration-200
              ${
                category === item.value
                  ? 'bg-primary text-white'
                  : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
              }
            `}
          >
            {item.label}
          </button>
        ))}

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto flex items-center gap-2 whitespace-nowrap"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Sắp xếp
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setSortBy(option.value)}
                // mode 
                className={sortBy === option.value ? 'bg-primary text-white' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
