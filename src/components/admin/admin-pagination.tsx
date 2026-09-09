import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function AdminPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 20],
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIdx = totalItems === 0 ? 0 : (validPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(validPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (validPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', validPage - 1, validPage, validPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-card border border-border/80 shadow-2xs text-xs">
      {/* Left: Range and Items Per Page */}
      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 sm:gap-4 text-muted-foreground">
        <span className="text-[11px] sm:text-xs">
          Showing <span className="font-semibold text-foreground font-mono">{startIdx}</span>-
          <span className="font-semibold text-foreground font-mono">{endIdx}</span> of{' '}
          <span className="font-semibold text-foreground font-mono">{totalItems}</span>
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 border-l border-border/80 pl-3 sm:pl-4">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase text-muted-foreground/80">Page:</span>
            <div className="flex items-center gap-0.5 sm:gap-1 bg-secondary/80 rounded-lg p-0.5 border border-border/60">
              {pageSizeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onItemsPerPageChange(opt)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md font-mono text-[10px] sm:text-[11px] font-semibold transition-all ${
                    itemsPerPage === opt
                      ? 'bg-butter text-butter-foreground shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-1">
        {/* First Page (Desktop only) */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={validPage === 1}
          className="hidden md:inline-flex p-1.5 rounded-lg border border-border/70 bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(validPage - 1)}
          disabled={validPage === 1}
          className="px-2.5 py-1.5 sm:p-1.5 rounded-lg border border-border/70 bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
          title="Previous Page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[11px]">Prev</span>
        </button>

        {/* Mobile Compact Page Indicator */}
        <div className="sm:hidden px-2 py-1 rounded-lg bg-secondary/80 font-mono text-xs font-semibold text-foreground">
          {validPage} / {totalPages}
        </div>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`dots-${idx}`} className="px-1.5 text-muted-foreground font-mono select-none">
                  …
                </span>
              );
            }
            const isCurrent = p === validPage;
            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(Number(p))}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-all ${
                  isCurrent
                    ? 'bg-butter text-butter-foreground shadow-2xs scale-105'
                    : 'bg-secondary/60 border border-border/70 text-foreground hover:bg-secondary'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(validPage + 1)}
          disabled={validPage === totalPages}
          className="px-2.5 py-1.5 sm:p-1.5 rounded-lg border border-border/70 bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1"
          title="Next Page"
        >
          <span className="text-[11px]">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page (Desktop only) */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={validPage === totalPages}
          className="hidden md:inline-flex p-1.5 rounded-lg border border-border/70 bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-all"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
