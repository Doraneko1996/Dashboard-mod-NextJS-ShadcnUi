'use client';

import { columns } from './_components/columns';
import { ManageListingPage } from '../_components/manage-listing-page';
import { useAdmins } from '@/hooks/use-admins';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
import { GENDER_OPTIONS, DISTRICT_OPTIONS } from '@/components/layout/UserForm/options';

export default function AdminsPage() {
    const {
        data,
        total,
        isLoading,
        filters,
        updateFilters,
    } = useAdmins();

    const tableFilters = (
        <>
            <DataTableSearch
                searchKey="admin"
                searchQuery={filters.search}
                setSearchQuery={(value) => updateFilters({ search: value })}
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
                        gender: value === 'null' ? null : value ? Number(value) : undefined
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
            description="Quản lý danh sách Admin trong hệ thống"
            total={total}
            createLink="/dashboard/manage/admins/create"
            createButtonLabel="Thêm Admin"
            data={data}
            columns={columns}
            searchKey="last_name"
            isLoading={isLoading}
            filters={tableFilters}
        />
    );
}