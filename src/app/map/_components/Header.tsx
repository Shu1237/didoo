'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter } from 'lucide-react';
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
    <div className="p-4 bg-background/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 flex gap-2">
      {/* Search Bar - Expands to fill available space */}
      <div className="relative flex-1 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 h-12 text-base bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-xl w-full"
        />
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`h-12 w-12 rounded-xl border-border bg-secondary/50 hover:bg-secondary hover:text-foreground p-0 ${category ? 'border-primary text-primary bg-primary/10' : 'text-muted-foreground'}`}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setCategory(null)} className={!category ? 'bg-primary/10 text-primary font-medium' : ''}>
            Tất cả danh mục
          </DropdownMenuItem>
          {eventTypes.filter(t => t.value !== null).map((item) => (
            <DropdownMenuItem
              key={item.label}
              onClick={() => setCategory(item.value)}
              className={category === item.value ? 'bg-primary/10 text-primary font-medium' : ''}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-12 w-12 rounded-xl border-border bg-secondary/50 hover:bg-secondary hover:text-foreground p-0 text-muted-foreground"
          >
            <ArrowUpDown className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={sortBy === option.value ? 'bg-primary/10 text-primary font-medium' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default Header;
