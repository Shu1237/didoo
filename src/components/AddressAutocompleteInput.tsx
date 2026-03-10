"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import envconfig from "../../config";
import { MapPin, Loader2 } from "lucide-react";

export interface MapboxFeature {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export interface AddressResult {
  address: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteInputProps {
  value: string | undefined;
  onChange: (result: AddressResult) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const DEBOUNCE_MS = 300;

export function AddressAutocompleteInput({
  value,
  onChange,
  placeholder = "Tìm địa chỉ...",
  error = false,
  className,
  disabled = false,
  id,
}: AddressAutocompleteInputProps) {
  const [inputValue, setInputValue] = useState(value ?? "");
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external value
  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const fetchSuggestions = useCallback(async (query: string) => {
    const token = envconfig.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || !query.trim()) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&autocomplete=true&country=vn&limit=5`;
      const res = await fetch(url);
      const data = await res.json();
      const features: MapboxFeature[] = data.features ?? [];
      setSuggestions(features);
      setHighlightIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!v.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(v);
      setIsOpen(true);
      debounceRef.current = null;
    }, DEBOUNCE_MS);
  };

  const selectSuggestion = (feature: MapboxFeature) => {
    const [lng, lat] = feature.center;
    setInputValue(feature.place_name);
    setSuggestions([]);
    setIsOpen(false);
    onChange({
      address: feature.place_name,
      latitude: lat,
      longitude: lng,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : i));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : -1));
    } else if (e.key === "Enter" && highlightIndex >= 0 && suggestions[highlightIndex]) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={cn(
            "pl-9 pr-9",
            error && "border-destructive",
            className
          )}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg py-1 max-h-60 overflow-auto"
          role="listbox"
        >
          {suggestions.map((feature, i) => (
            <li
              key={feature.place_name + i}
              role="option"
              aria-selected={i === highlightIndex}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm hover:bg-zinc-100",
                i === highlightIndex && "bg-zinc-100"
              )}
              onMouseEnter={() => setHighlightIndex(i)}
              onClick={() => selectSuggestion(feature)}
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                {feature.place_name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
