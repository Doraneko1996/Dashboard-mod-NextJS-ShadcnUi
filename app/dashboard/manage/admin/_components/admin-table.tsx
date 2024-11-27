'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import { GENDER_OPTIONS, useAdminTableFilters } from './hooks/use-admin-table-filters';
import { useAdminsContext } from './hooks/admins-context';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { memo } from 'react';

export default memo(function AdminTable() {
    console.log('AdminTable component rendered');
    const {
        genderFilter,
        setGenderFilter,
        isAnyFilterActive,
        resetFilters,
        searchQuery,
        setSearchQuery
    } = useAdminTableFilters();

    const {
        data = [],
        total = 0,
        isLoading,
        refresh
    } = useAdminsContext();

    if (isLoading) {
        return <DataTableSkeleton />;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
                <DataTableSearch
                    searchKey="admin"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <DataTableFilterBox
                    filterKey="gender"
                    title="Giới tính"
                    options={GENDER_OPTIONS}
                    setFilterValue={setGenderFilter}
                    filterValue={genderFilter}
                />
                <DataTableResetFilter
                    isFilterActive={isAnyFilterActive}
                    onReset={resetFilters}
                />
            </div>
            <DataTable
                data={data}
                columns={columns}
                totalItems={total}
                loading={isLoading}
                onRefresh={refresh}
            />
        </div>
    );
});