'use client';

import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/ui/table/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface ManageListingPageProps<TData> {
    title: string;
    description: string;
    total: number;
    createLink?: string;
    createButtonLabel?: string;
    data: TData[];
    columns: ColumnDef<TData, any>[];
    filters?: React.ReactNode;
    searchKey: string;
    isLoading?: boolean;
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
    searchKey,
    isLoading = false
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
                    <div className="flex flex-wrap items-center gap-4">
                        {filters}
                    </div>
                    <DataTable
                        data={data}
                        columns={columns}
                        totalItems={total}
                        loading={isLoading}
                    />
                </div>
            </div>
        </PageContainer>
    );
}