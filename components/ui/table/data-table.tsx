'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon, RefreshCcw } from 'lucide-react';
import { parseAsInteger, useQueryState } from 'nuqs';
import React from 'react';
import { DataTableSkeleton } from './data-table-skeleton';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  onSortingChange?: (sorting: SortingState) => void;
  isAnyFilterActive?: boolean;
  resetFilters?: () => void;
  pageSizeOptions?: number[];
  filters?: React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  onSortingChange,
  loading = false,
  onRefresh,
  pageSizeOptions = [10, 50, 100, 200, 500]
}: DataTableProps<TData, TValue>) {

  const [currentPage, setCurrentPage] = useQueryState(
    'page',
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    'limit',
    parseAsInteger
      .withOptions({ shallow: false, history: 'push' })
      .withDefault(10)
  );

  const [elementWidth, setElementWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const updateWidth = () => {
      const element = document.getElementById('data-table-container');
      if (element) {
        const newWidth = element.clientWidth - 8;
        if (newWidth !== elementWidth) {
          setElementWidth(newWidth);
        }
      }
    };

    // Lắng nghe cả resize window và sidebar
    const handleResize = () => {
      requestAnimationFrame(updateWidth);
    };

    // Lắng nghe click event của nút toggle sidebar
    const handleSidebarToggle = () => {
      // Đợi animation hoàn thành
      setTimeout(() => {
        requestAnimationFrame(updateWidth);
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('sidebar-resize', handleResize);

    // Lắng nghe click event của nút toggle
    const sidebarToggleBtn = document.querySelector('button[data-sidebar="rail"]');
    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', handleSidebarToggle);
    }

    // Khởi tạo width ban đầu
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('sidebar-resize', handleResize);

      // Cleanup click event listener
      const sidebarToggleBtn = document.querySelector('button[data-sidebar="rail"]');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.removeEventListener('click', handleSidebarToggle);
      }
    };
  }, [elementWidth]);

  const paginationState = {
    pageIndex: currentPage - 1, // zero-based index for React Table
    pageSize: pageSize
  };

  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePaginationChange = (
    updaterOrValue:
      | PaginationState
      | ((old: PaginationState) => PaginationState)
  ) => {
    const pagination =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(paginationState)
        : updaterOrValue;

    setCurrentPage(pagination.pageIndex + 1); // converting zero-based index to one-based
    setPageSize(pagination.pageSize);
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount,
    state: {
      pagination: paginationState,
      sorting,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSorting);
      // Gọi callback để parent component xử lý
      onSortingChange?.(newSorting);
    },
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
    enableSorting: true,
    manualSorting: true,
  });

  const handleRefresh = () => {
    // Reset sorting state
    setSorting([]);
    // Gọi callback để parent component xử lý
    onRefresh?.();
  };

  // Xử lý loading state bằng Skeleton
  if (loading) {
    return (
      <DataTableSkeleton
        columnCount={columns.length}
        rowCount={10}
      />
    );
  }

  return (
    <div id="data-table-container" className="space-y-4">
      <ScrollArea className="rounded-md border">
        <div className="py-2 xl:pl-2" style={{ width: elementWidth }}>
          <Table className="relative">
            <TableHeader className="text-xs font-medium">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có dữ liệu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex items-center gap-2">
          <Select
            value={`${paginationState.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={paginationState.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Tải lại dữ liệu</span>
          </Button>
        </div>
        <div className="flex-none flex items-center gap-2">
          <div className="flex-none min-w-[120px] text-center text-sm font-medium">
            {totalItems > 0 ? (
              <>
                Trang {paginationState.pageIndex + 1} / {table.getPageCount()}
              </>
            ) : (
              ''
            )}
          </div>
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
