interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(0);

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages - 2, currentPage + 1);

    if (currentPage <= 2) {
      start = 1;
      end = Math.min(maxVisible - 1, totalPages - 2);
    } else if (currentPage >= totalPages - 3) {
      start = Math.max(1, totalPages - maxVisible);
      end = totalPages - 2;
    }

    if (start > 1) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 2) pages.push('...');

    pages.push(totalPages - 1);
    return pages;
  };

  return (
    <nav aria-label="페이지 네비게이션" className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="이전 페이지"
      >
        &laquo;
      </button>

      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-colors
              ${page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`${page + 1}페이지`}
          >
            {page + 1}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100
          disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="다음 페이지"
      >
        &raquo;
      </button>
    </nav>
  );
}
