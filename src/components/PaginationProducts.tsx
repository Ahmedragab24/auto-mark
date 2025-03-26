"use client";

import type React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { setCurrentPage } from "@/store/features/currentPage";
import { useEffect, useCallback } from "react";

interface PaginationProductsProps {
  totalPages: number;
  className?: string;
}

const PaginationProducts: React.FC<PaginationProductsProps> = ({
  totalPages,
  className = "",
}) => {
  const { currentPage } = useAppSelector(
    (state: RootState) => state.CurrentPage
  );
  const dispatch = useAppDispatch();

  // Scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        dispatch(setCurrentPage(newPage));
      }
    },
    [dispatch, totalPages]
  );

  const renderPageNumbers = useCallback(() => {
    if (totalPages <= 1) return [];

    const visiblePages = 5; // Number of visible pages
    const halfVisible = Math.floor(visiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    const pageNumbers = [];

    if (startPage > 1) {
      pageNumbers.push(
        <PaginationItem key="start">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCurrentPage(1));
            }}
            aria-label="Go to first page"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink
            className={`${
              currentPage === i ? "bg-primary text-white" : "bg-secondary"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCurrentPage(i));
            }}
            aria-label={`Page ${i}`}
            aria-current={currentPage === i ? "page" : undefined}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      pageNumbers.push(
        <PaginationItem key="end">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCurrentPage(totalPages));
            }}
            aria-label="Go to last page"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageNumbers;
  }, [currentPage, dispatch, totalPages]);

  // Don't render anything if there's only one page or less
  if (totalPages <= 1) return null;

  return (
    <Pagination dir="ltr" className={className}>
      <PaginationContent className="flex flex-wrap justify-center">
        <PaginationItem>
          <PaginationPrevious
            className={`${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "bg-secondary"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            aria-label="Go to previous page"
            aria-disabled={currentPage === 1}
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            className={`${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "bg-secondary"
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            aria-label="Go to next page"
            aria-disabled={currentPage === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationProducts;
