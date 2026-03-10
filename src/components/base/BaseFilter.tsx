'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export type FilterType = 'text' | 'select' | 'date' | 'number'

export interface FilterOption {
    label: string
    value: string | number
}

export interface FilterConfig {
    key: string
    label: string
    type: FilterType
    placeholder?: string
    options?: FilterOption[]
    defaultValue?: string | number
    className?: string // col-span-2 etc
}

interface BaseFilterProps {
    filters: FilterConfig[]
    onFilterChange?: (key: string, value: any) => void
    defaultValues?: Record<string, any>
}

export default function BaseFilter({ filters, onFilterChange }: BaseFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Initialize local state for text inputs (debounce)
    const [localState, setLocalState] = useState<Record<string, string>>(() => {
        const initialState: Record<string, string> = {}
        filters.forEach(filter => {
            if (filter.type === 'text') {
                initialState[filter.key] = searchParams.get(filter.key) || (filter.defaultValue as string) || ''
            }
        })
        return initialState
    })

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString())

            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === '' || value === undefined) {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, String(value))
                }
            })

            // Reset page on filter change
            if (params.page === undefined && params.pageNumber === undefined) {
                newSearchParams.delete('page')
                newSearchParams.set('pageNumber', '1')
            }

            return newSearchParams.toString()
        },
        [searchParams]
    )

    const updateURL = (key: string, value: string | null) => {
        router.push(pathname + '?' + createQueryString({ [key]: value }))
        if (onFilterChange) {
            onFilterChange(key, value)
        }
    }

    // Debounce effect just for text inputs in localState
    useEffect(() => {
        const timer = setTimeout(() => {
            Object.keys(localState).forEach(key => {
                const currentParam = searchParams.get(key) || ''
                if (localState[key] !== currentParam) {
                    updateURL(key, localState[key])
                }
            })
        }, 500)

        return () => clearTimeout(timer)
    }, [localState]) // Logic: when localState changes, debounce update URL

    const handleValuesChange = (key: string, value: string) => {
        // for text inputs, only update local state, effect will handle URL update
        const filterDef = filters.find(f => f.key === key)
        if (filterDef?.type === 'text') {
            setLocalState(prev => ({ ...prev, [key]: value }))
        } else {
            // for select/date, update URL immediately
            updateURL(key, value)
        }
    }

    // Clear all filters
    const clearFilters = () => {
        router.push(pathname)
        // Also reset local state
        const resetState: Record<string, string> = {}
        filters.forEach(filter => {
            if (filter.type === 'text') {
                resetState[filter.key] = ''
            }
        })
        setLocalState(resetState)
    }

    return (
        <div className="bg-card p-4 rounded-xl shadow-sm mb-6 border border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filters.map((filter) => {
                const paramValue = searchParams.get(filter.key)
                const value = filter.type === 'text'
                    ? (localState[filter.key] !== undefined ? localState[filter.key] : (paramValue || ''))
                    : (paramValue ?? filter.defaultValue ?? '')

                return (
                    <div key={filter.key} className={cn("space-y-2", filter.className)}>
                        <Label className="text-sm font-medium text-foreground">{filter.label}</Label>

                        {filter.type === 'text' && (
                            <Input
                                type="text"
                                placeholder={filter.placeholder}
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="w-full"
                            />
                        )}

                        {filter.type === 'select' && (
                            <Select
                                value={value === '' || value === undefined ? '__all__' : String(value)}
                                onValueChange={(v) => handleValuesChange(filter.key, v === '__all__' ? '' : v)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tất cả" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filter.options?.map((opt) => (
                                        <SelectItem
                                            key={String(opt.value)}
                                            value={opt.value === '' || opt.value === undefined ? '__all__' : String(opt.value)}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {filter.type === 'date' && (
                            <Input
                                type="date"
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="w-full"
                            />
                        )}

                        {filter.type === 'number' && (
                            <Input
                                type="number"
                                placeholder={filter.placeholder}
                                value={value}
                                onChange={(e) => handleValuesChange(filter.key, e.target.value)}
                                className="w-full"
                            />
                        )}
                    </div>
                )
            })}

            <div className="flex items-end">
                <Button
                    variant="secondary"
                    onClick={clearFilters}
                    className="w-full"
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </div>
    )
}
