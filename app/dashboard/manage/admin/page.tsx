'use client';

import { columns } from './_components/columns';
import { ManageListingPage } from '../_components/manage-listing-page';
import { useAdmins } from '@/hooks/use-admins';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { GENDER_OPTIONS, DISTRICT_OPTIONS } from '@/components/layout/UserForm/options';
import { SortingState } from '@tanstack/react-table';

export default function AdminsPage() {
    const {
        data,
        total,
        isLoading,
        filters,
        updateFilters,
        isAnyFilterActive,
        resetFilters,
        refresh
    } = useAdmins();

    const handleSortingChange = (sorting: SortingState) => {
        if (sorting.length > 0) {
            const { id, desc } = sorting[0];
            updateFilters({
                sortBy: id,
                order: desc ? 'DESC' : 'ASC'
            });
        }
    };

    const tableFilters = (
        <>
            <DataTableSearch
                searchKey="admin"
                searchQuery={filters.search}
                setSearchQuery={(value) => updateFilters({ search: value })}
                minLength={2}
            />
            <DataTableFilterBox
                filterKey="gender"
                title="Giới tính"
                options={[
                    { label: 'Bỏ trống', value: 'null' },
                    ...GENDER_OPTIONS
                ]}
                filterValue={filters.gender === null ? 'null' : filters.gender?.toString()}
                setFilterValue={(value) => {
                    updateFilters({
                        gender: value === 'null' ? null : value || undefined
                    });
                }}
            />
            <DataTableFilterBox
                filterKey="district"
                title="Quận/Huyện"
                options={[
                    { label: 'Bỏ trống', value: 'null' },
                    ...DISTRICT_OPTIONS
                ]}
                filterValue={filters.district === null ? 'null' : filters.district}
                setFilterValue={(value) => {
                    updateFilters({
                        district: value === 'null' ? null : value || undefined
                    });
                }}
            />
        </>
    );

    return (
        <ManageListingPage
            title="Admin"
            description="Quản lý danh sách Admin"
            total={total}
            createLink="/dashboard/manage/admins/create"
            createButtonLabel="Admin"
            data={data}
            columns={columns}
            isLoading={isLoading}
            filters={tableFilters}
            onSortingChange={handleSortingChange}
            isAnyFilterActive={isAnyFilterActive}
            resetFilters={resetFilters}
            onRefresh={refresh}
        />
    );
}