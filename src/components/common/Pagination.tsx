import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Page <span className="font-semibold text-foreground">{page}</span> of{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          id="prev-page-btn"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground">
          <ChevronLeft className="size-4" />
          Previous
        </button>
        <button
          id="next-page-btn"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-foreground">
          Next
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
