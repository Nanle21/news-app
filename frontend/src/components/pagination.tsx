import { useTranslation } from 'react-i18next';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { Button } from './index';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  className = '',
}: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      const adjustedStart = end === totalPages ? Math.max(1, end - maxVisiblePages + 1) : start;
      
      for (let i = adjustedStart; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {t('common.pagination.showing', { start: startItem, end: endItem, total: totalItems })}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2"
        >
          <HiOutlineChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t('common.pagination.previous')}</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'primary' : 'secondary'}
              onClick={() => onPageChange(page)}
              className="px-3 py-2 min-w-[40px]"
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Next button */}
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2"
        >
          <HiOutlineChevronRight className="h-4 w-4" />
          <span className="sr-only">{t('common.pagination.next')}</span>
        </Button>
      </div>
    </div>
  );
} 