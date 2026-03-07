"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showInfo?: boolean;
  showSizeSelector?: boolean;
}

export function UserPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onPageSizeChange,
  pageSizeOptions = [9, 12, 18, 24],
  showInfo = true,
  showSizeSelector = true,
}: UserPaginationProps) {
  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  };

  const from = totalItems && itemsPerPage ? Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) : 0;
  const to = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-4">
        {showInfo && totalItems !== undefined && itemsPerPage !== undefined && totalItems > 0 && (
          <p className="text-sm text-zinc-600">
            Hiển thị <span className="font-semibold text-zinc-900">{from}</span>-
            <span className="font-semibold text-zinc-900">{to}</span> /{" "}
            <span className="font-semibold text-zinc-900">{totalItems}</span>
          </p>
        )}
        {showSizeSelector && onPageSizeChange && itemsPerPage !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500">Số mục:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-9 px-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => currentPage > 1 && onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "flex items-center gap-1 h-10 px-3 rounded-xl text-sm font-medium transition-colors",
            currentPage <= 1
              ? "text-zinc-300 cursor-not-allowed"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, i) =>
            page === "ellipsis" ? (
              <span key={`e-${i}`} className="w-10 h-10 flex items-center justify-center text-zinc-400">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={cn(
                  "min-w-[40px] h-10 px-3 rounded-xl text-sm font-medium transition-colors",
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => currentPage < totalPages && onPageChange?.(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "flex items-center gap-1 h-10 px-3 rounded-xl text-sm font-medium transition-colors",
            currentPage >= totalPages
              ? "text-zinc-300 cursor-not-allowed"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
