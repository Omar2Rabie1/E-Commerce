// app/products/components/ProductsPagination.tsx
'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
  categoryId?: string;
}

export default function ProductsPagination({
  currentPage,
  totalPages,
  totalProducts,
  limit,
  categoryId
}: ProductsPaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // دالة بناء الرابط مع دعم الكاتيجوري
  const buildPageUrl = (page: number, newLimit?: number) => {
    const params = new URLSearchParams();
    
    if (page > 1) params.set('page', page.toString());
    if (newLimit && newLimit !== 15) params.set('limit', newLimit.toString());
    if (categoryId) params.set('category', categoryId);
    
    const queryString = params.toString();
    return `/products${queryString ? `?${queryString}` : ''}`;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalProducts);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 relative z-10 transition-colors duration-300">
      {/* معلومات الصفحة */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Showing {startItem} to {endItem} of {totalProducts} products
        {categoryId && ` in this category`}
      </div>

      {/* أزرار الباجينيشن */}
      <div className="flex items-center gap-2">
        {/* زر الصفحة السابقة */}
        <Link
          href={buildPageUrl(currentPage - 1)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
            currentPage === 1
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-cyan-500 hover:text-blue-600 dark:hover:text-cyan-400'
          }`}
          aria-disabled={currentPage === 1}
          tabIndex={currentPage === 1 ? -1 : 0}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>

        {/* أرقام الصفحات */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page) => (
            <Link
              key={page}
              href={buildPageUrl(page)}
              className={`min-w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 border-blue-600 dark:border-cyan-500 text-white font-semibold'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-cyan-500'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>

        {/* زر الصفحة التالية */}
        <Link
          href={buildPageUrl(currentPage + 1)}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500 dark:hover:border-cyan-500 hover:text-blue-600 dark:hover:text-cyan-400'
          }`}
          aria-disabled={currentPage === totalPages}
          tabIndex={currentPage === totalPages ? -1 : 0}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* اختيار عدد العناصر في الصفحة */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Items per page:</span>
        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 transition-colors duration-200"
          value={limit}
          onChange={(e) => {
            const newLimit = parseInt(e.target.value);
            if (typeof window !== 'undefined') {
              window.location.href = buildPageUrl(1, newLimit);
            }
          }}
        >
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </div>
    </div>
  );
}