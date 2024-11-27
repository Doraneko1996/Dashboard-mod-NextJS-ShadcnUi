'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table } from '@/components/ui/table';
import { useTableState } from './hooks/use-table-state';
import { DataTableHeader } from './components/data-table-header';
import { DataTableBody } from './components/data-table-body';
import { DataTablePagination } from './components/data-table-pagination';
import { DataTableSkeleton } from './data-table-skeleton';
import type { DataTableProps } from './types/table.types';
import { getCoreRowModel, getPaginationRowModel, SortingState } from '@tanstack/react-table';
import { useReactTable } from '@tanstack/react-table';
import { useCallback } from 'react';

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems = 0,
  onSortingChange,
  loading = false,
  onRefresh,
  pageSizeOptions = [10, 50, 100, 200, 500]
}: DataTableProps<TData, TValue>) {
  const {
    pageSize,
    sorting,
    setSorting,
    paginationState,
    handlePaginationChange
  } = useTableState();

  const handleSortingChange = useCallback((updater: SortingState | ((old: SortingState) => SortingState)) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    setSorting(newSorting);
    onSortingChange?.(newSorting);
  }, [sorting, setSorting, onSortingChange]);

  const handleRefresh = useCallback(() => {
    setSorting([]);
    onSortingChange?.([]);
    onRefresh?.();
  }, [setSorting, onSortingChange, onRefresh]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / pageSize),
    state: {
      pagination: paginationState,
      sorting,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    enableSorting: true,
    manualSorting: true,
  });

  if (loading) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={10} />;
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="grid h-[calc(80vh-220px)] rounded-md border md:h-[calc(90dvh-240px)]">
        <Table className="relative">
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DataTablePagination
        table={table}
        totalItems={totalItems}
        pageSizeOptions={pageSizeOptions}
        paginationState={paginationState}
        loading={loading}
        onRefresh={handleRefresh}
        handlePaginationChange={handlePaginationChange}
      />
    </div>
  );
}
