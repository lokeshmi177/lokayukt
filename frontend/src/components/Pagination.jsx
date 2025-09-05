// components/Pagination.js
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage, 
  showInfo = true 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        if (currentPage > 1) pages.push(currentPage - 1);
        pages.push(currentPage);
        if (currentPage < totalPages) pages.push(currentPage + 1);
        
        if (currentPage > 2) pages.unshift(1, '...');
        if (currentPage < totalPages - 1) pages.push('...', totalPages);
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 gap-3 sm:gap-0">
      {/* Info Section */}
      {showInfo && (
        <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
          Showing {startItem}-{endItem} of {totalItems} results
        </div>
      )}
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-1 order-1 sm:order-2 w-full sm:w-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold 
            transition-all duration-300 ease-in-out transform hover:scale-105
            ${currentPage === 1 
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50' 
              : 'text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
            }
          `}
        >
          <FaChevronLeft className="w-3 h-3" />
          <span className="hidden sm:inline ml-1">Previous</span>
        </button>
        
        <div className="flex items-center space-x-0.5 sm:space-x-1">
          {getVisiblePages().map((page, index) => (
            page === '...' ? (
              <span 
                key={`ellipsis-${index}`} 
                className="px-1 sm:px-3 py-2 text-gray-400 text-xs sm:text-sm font-medium"
              >
                <span className="flex space-x-0.5 sm:space-x-1">
                  <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </span>
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`
                  relative inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold
                  transition-all duration-300 ease-in-out transform hover:scale-110 shadow-sm
                  ${currentPage === page
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-500' 
                    : 'text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:text-blue-600'
                  }
                `}
              >
                {page}
                {currentPage === page && (
                  <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-white opacity-20 animate-ping"></div>
                )}
              </button>
            )
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            inline-flex items-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold
            transition-all duration-300 ease-in-out transform hover:scale-105
            ${currentPage === totalPages 
              ? 'text-gray-400 bg-gray-100 cursor-not-allowed opacity-50' 
              : 'text-gray-700 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-600 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
            }
          `}
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
