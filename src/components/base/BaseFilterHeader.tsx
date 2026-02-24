"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type FilterType = "text" | "select";

export interface FilterOption {
    label: string;
    value: string | number;
}

export interface FilterHeaderConfig {
    key: string;
    label: string;
    type: FilterType;
    placeholder?: string;
    options?: FilterOption[];
    width?: string;
}

interface BaseFilterHeaderProps {
    filters: FilterHeaderConfig[];
    children?: React.ReactNode; // For pagination
}

export default function BaseFilterHeader({ filters, children }: BaseFilterHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [localState, setLocalState] = useState<Record<string, string>>(() => {
        const initialState: Record<string, string> = {};
        filters.forEach((filter) => {
            if (filter.type === "text") {
                initialState[filter.key] = searchParams.get(filter.key) || "";
            }
        });
        return initialState;
    });

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === "" || value === undefined) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            });

            // Reset page on filter change
            newSearchParams.set("pageNumber", "1");

            return newSearchParams.toString();
        },
        [searchParams]
    );

    const updateURL = (key: string, value: string | null) => {
        router.push(pathname + "?" + createQueryString({ [key]: value }));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            Object.keys(localState).forEach((key) => {
                const currentParam = searchParams.get(key) || "";
                if (localState[key] !== currentParam) {
                    updateURL(key, localState[key]);
                }
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [localState, searchParams]);

    const handleValuesChange = (key: string, value: string) => {
        const filterDef = filters.find((f) => f.key === key);
        if (filterDef?.type === "text") {
            setLocalState((prev) => ({ ...prev, [key]: value }));
        } else {
            updateURL(key, value);
        }
    };

    const clearFilters = () => {
        router.push(pathname);
        const resetState: Record<string, string> = {};
        filters.forEach((filter) => {
            if (filter.type === "text") resetState[filter.key] = "";
        });
        setLocalState(resetState);
    };

    const hasFilters = filters.some(f => {
        const val = searchParams.get(f.key);
        return val && val !== "ALL" && val !== "";
    });

    return (
        <div className="flex items-center gap-3">
            {filters.map((filter) => {
                const paramValue = searchParams.get(filter.key);
                const value = filter.type === "text"
                    ? (localState[filter.key] !== undefined ? localState[filter.key] : (paramValue || ""))
                    : (paramValue || "");

                return (
                    <div key={filter.key} style={{ width: filter.width || "160px" }}>
                        {filter.type === "text" ? (
                            <Input
                                placeholder={filter.placeholder || filter.label}
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="h-9 px-3 text-xs bg-white border-zinc-200 rounded-xl focus-visible:ring-1 focus-visible:ring-zinc-400 placeholder:text-zinc-400 font-medium"
                            />
                        ) : (
                            <Select
                                value={value}
                                onValueChange={(val) => handleValuesChange(filter.key, val)}
                            >
                                <SelectTrigger className="h-9 text-xs bg-white border-zinc-200 rounded-xl focus:ring-1 focus:ring-zinc-400 font-medium">
                                    <SelectValue placeholder={filter.label}>
                                        {value === "ALL" || !value
                                            ? `Tất cả ${filter.label.toLowerCase()}`
                                            : filter.options?.find(opt => opt.value.toString() === value)?.label}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                                    <SelectItem value="ALL" className="text-xs font-medium">Tất cả {filter.label.toLowerCase()}</SelectItem>
                                    {filter.options?.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value.toString()} className="text-xs font-medium">
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                );
            })}

            {/* Pagination injection */}
            {children && (
                <div className="flex items-center gap-2 pl-2 border-l border-zinc-100 ml-1">
                    {children}
                </div>
            )}

            {hasFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                >
                    <X className="w-4 h-4 mr-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Xóa lọc</span>
                </Button>
            )}
        </div>
    );
}
