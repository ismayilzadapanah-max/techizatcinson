"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
}: PaginationProps) {
  const showing = Math.min(currentPage * itemsPerPage, totalItems);
  const from = (currentPage - 1) * itemsPerPage + 1;

  if (totalPages <= 1 && totalItems === 0) {
    return (
      <div className="px-6 py-4 text-sm text-brand-muted text-center">
        Göstərilən məlumat yoxdur
      </div>
    );
  }

  return (
    <div className="px-6 py-4 bg-[#F9FAFB] flex items-center justify-between border-t border-[#E9E8EE] flex-wrap gap-4">
      <p className="text-sm text-brand-muted">
        Göstərilir:{" "}
        <span className="font-semibold text-[#141647]">
          {from}-{showing}
        </span>{" "}
        / cəmi <span className="font-semibold">{totalItems}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#D1D1DB] text-brand-muted hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold ${
                page === currentPage
                  ? "bg-[#141647] text-white"
                  : "border border-[#D1D1DB] text-brand-muted hover:bg-white"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-[#D1D1DB] text-brand-muted hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
