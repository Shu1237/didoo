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
import { CATEGORIES } from '@/utils/mock';

interface HeaderProps {
  category: string | null;
  setCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'date' | 'distance' | 'price';
  setSortBy: (sort: 'date' | 'distance' | 'price') => void;
}

const Header = ({ category, setCategory, searchQuery, setSearchQuery, sortBy, setSortBy }: HeaderProps) => {
  const eventTypes = CATEGORIES;

  const sortOptions = [
    { label: 'Ngày diễn ra', value: 'date' as const },
    { label: 'Khoảng cách', value: 'distance' as const },
    { label: 'Giá vé', value: 'price' as const },
  ];

  return (
    <div className="w-full flex items-center gap-2">
      {/* Search Input */}
      <div className="relative group flex-1">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm..."
          className="pl-9 h-10 rounded-xl bg-background/50 border-border/50 hover:bg-background/80 hover:border-primary/30 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
        />
      </div>

      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`h-10 px-3 rounded-xl border-border/50 ${category ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background/50 hover:bg-background/80'}`}>
            <span className="truncate text-sm font-medium mr-2 hidden sm:inline">{category ? eventTypes.find(t => t.name === category)?.name : 'Lọc'}</span>
            <Filter className="w-3.5 h-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 overflow-hidden rounded-xl border-border/50 backdrop-blur-xl bg-background/95">
          {eventTypes.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => setCategory(item.name)}
              className="focus:bg-primary/10 focus:text-primary cursor-pointer my-1 rounded-lg"
            >
              {item.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-xl border-border/50 bg-background/50 hover:bg-background/80 hover:text-primary transition-colors">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 overflow-hidden rounded-xl border-border/50 backdrop-blur-xl bg-background/95">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`focus:bg-primary/10 focus:text-primary cursor-pointer my-1 rounded-lg ${sortBy === option.value ? 'text-primary font-medium bg-primary/5' : ''}`}
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
