"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
import { BiChevronLeft } from "react-icons/bi";
import { ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [page, setPage] = useState(currentPage);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  // Generate page numbers with ellipsis for large number of pages
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Show ellipsis or additional pages
      if (page > 3) {
        pageNumbers.push("ellipsis1");
      }

      // Show pages around current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Show ellipsis or additional pages
      if (page < totalPages - 2) {
        pageNumbers.push("ellipsis2");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <Button
        disabled={page === 1}
        base
        onClick={() => handlePageChange(page - 1)}
      >
        <BiChevronLeft className="h-4 w-4" />
        <span
          className={`hidden sm:inline text-sm ${
            page === 1 ? "" : "text-black font-semibold"
          }`}
        >
          Anterior
        </span>
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === "ellipsis1" || pageNumber === "ellipsis2" ? (
            <div key={`${pageNumber}-${index}`} className="px-2">
              &hellip;
            </div>
          ) : (
            <Button
              key={pageNumber}
              onClick={() => handlePageChange(Number(pageNumber))}
              className={`h-8 w-8 text-sm ${
                pageNumber === page ? "border-2 font-semibold" : ""
              }`}
              base={pageNumber !== page}
              baseFill={pageNumber === page}
            >
              {pageNumber}
            </Button>
          )
        )}
      </div>

      <Button
        disabled={page === totalPages}
        base
        onClick={() => handlePageChange(page + 1)}
      >
        <span
          className={`hidden sm:inline text-sm ${
            page === totalPages ? "" : "text-black font-semibold"
          }`}
        >
          Siguiente
        </span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
