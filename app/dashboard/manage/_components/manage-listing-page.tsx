'use client';

import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';

interface ManageListingPageProps<TData> {
    title: string;
    description: string;
    total: number;
    createLink?: string;
    createButtonLabel?: string;
    data: TData[];
    columns: ColumnDef<TData, any>[];
    filters?: React.ReactNode;
    isLoading?: boolean;
    onSortingChange?: (sorting: SortingState) => void;
    isAnyFilterActive?: boolean;
    resetFilters?: () => void;
    onRefresh?: () => void;
}

export function ManageListingPage<TData>({
    title,
    description,
    total,
    createLink,
    createButtonLabel = "Thêm mới",
    data,
    columns,
    filters,
    isLoading = false,
    onSortingChange,
    isAnyFilterActive,
    resetFilters,
    onRefresh
}: ManageListingPageProps<TData>) {
    return (
        <PageContainer>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={title}
                        status={total}
                        description={description}
                    />

                    {createLink && (
                        <Link
                            href={createLink}
                            className={cn(buttonVariants({ variant: 'default' }))}
                        >
                            <Plus className="mr-2 h-4 w-4" /> {createButtonLabel}
                        </Link>
                    )}
                </div>
                <Separator />
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {filters}
                        {isAnyFilterActive && (
                            <DataTableResetFilter
                                isFilterActive={isAnyFilterActive}
                                onReset={resetFilters}
                            />
                        )}
                    </div>
                    <DataTable
                        data={data}
                        columns={columns}
                        totalItems={total}
                        loading={isLoading}
                        onSortingChange={onSortingChange}
                        onRefresh={() => {
                            onSortingChange?.([]);
                            onRefresh?.();
                        }}
                    />
                </div>
            </div>
        </PageContainer>
    );
}