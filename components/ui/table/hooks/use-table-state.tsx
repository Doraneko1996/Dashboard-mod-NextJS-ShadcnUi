import { useState, useCallback } from 'react';
import { useQueryState } from 'nuqs';
import { parseAsInteger } from 'nuqs/server';
import type { PaginationState, SortingState } from '@tanstack/react-table';

export function useTableState() {
  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger.withDefault(10)
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  // Tạo paginationState từ currentPage và pageSize
  const paginationState: PaginationState = {
    pageIndex: (currentPage || 1) - 1, // Convert to zero-based
    pageSize: pageSize || 10
  };

  const handlePaginationChange = useCallback((
    updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage(pagination.pageIndex + 1);
    setPageSize(pagination.pageSize);
  }, [setCurrentPage, setPageSize, paginationState]);

  return {
    currentPage,
    pageSize,
    sorting,
    setSorting,
    paginationState,
    handlePaginationChange
  };
}