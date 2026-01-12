import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BasePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
    itemsPerPage?: number;
    className?: string;
}

export function BasePagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    className,
}: BasePaginationProps) {
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className={cn(
            "flex flex-col-reverse gap-3 w-full antialiased font-sans",
            "xs:flex-row xs:items-center xs:justify-between xs:gap-0",
            className
        )}>
            {/* Info text */}
            {/* {totalItems !== undefined && itemsPerPage !== undefined && (
                <p className={cn(
                    "text-muted-foreground font-medium text-center xs:text-left",
                    "text-xs sm:text-sm whitespace-nowrap"
                )}>
                    <span className="text-foreground font-semibold">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span>
                    -
                    <span className="text-foreground font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span>
                    <span className="mx-1">/</span>
                    <span className="text-foreground font-semibold">{totalItems}</span>
                </p>
            )} */}

            {/* Pagination Controls */}
            <Pagination className="mx-0 w-full xs:w-auto flex justify-center xs:justify-end">
                <PaginationContent className="gap-1">
                    {/* Previous Button (Icon Only) */}
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                            className={cn(
                                "cursor-pointer h-8 w-8 p-0 rounded-lg border-transparent hover:bg-muted transition-colors",
                                currentPage === 1 && "pointer-events-none opacity-40"
                            )}
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {generatePageNumbers().map((page, index) => (
                        <PaginationItem key={index} className={cn(
                            typeof page === 'number' && page !== 1 && page !== totalPages && page !== currentPage
                                ? "hidden sm:inline-block" : ""
                        )}>
                            {page === '...' ? (
                                <PaginationEllipsis className="h-8 w-8" />
                            ) : (
                                <PaginationLink
                                    onClick={() => onPageChange(page as number)}
                                    isActive={currentPage === page}
                                    className={cn(
                                        "cursor-pointer h-8 w-8 rounded-lg text-xs font-medium transition-all",
                                        currentPage === page
                                            ? "bg-primary text-primary-foreground shadow-md border-primary"
                                            : "border-transparent hover:bg-muted hover:border-border"
                                    )}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    {/* Next Button (Icon Only) */}
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                            className={cn(
                                "cursor-pointer h-8 w-8 p-0 rounded-lg border-transparent hover:bg-muted transition-colors",
                                currentPage === totalPages && "pointer-events-none opacity-40"
                            )}
                            aria-label="Next"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}