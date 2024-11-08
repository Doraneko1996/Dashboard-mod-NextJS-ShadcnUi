import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon, RefreshCcw } from 'lucide-react';
import type { PaginationState, Table } from '@tanstack/react-table';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    totalItems: number;
    pageSizeOptions: number[];
    paginationState: {
        pageIndex: number;
        pageSize: number;
    };
    loading?: boolean;
    onRefresh?: () => void;
    handlePaginationChange: (state: PaginationState) => void;
}

export function DataTablePagination<TData>({
    table,
    totalItems,
    pageSizeOptions,
    paginationState,
    loading,
    onRefresh,
    handlePaginationChange,
}: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between gap-2 pb-4">
            <div className="flex items-center gap-2">
                <Select
                    value={`${paginationState.pageSize}`}
                    onValueChange={(value) => {
                        handlePaginationChange({
                            pageIndex: 0,
                            pageSize: Number(value)
                        });
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
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <RefreshCcw className="h-4 w-4" />
                    <span className="sr-only">Tải lại dữ liệu</span>
                </Button>
            </div>

            {/* Pagination Controls */}
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
    );
} 