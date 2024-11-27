'use client';

import { useAdminsContext } from './admins-context';
import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo } from 'react';


export const GENDER_OPTIONS = [
  { value: 'null', label: 'Bỏ trống' },
  { value: '0', label: 'Nam' },
  { value: '1', label: 'Nữ' }
];

export function useAdminTableFilters() {
  const { updateFilters } = useAdminsContext();

  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({
        shallow: true,
        throttleMs: 1000
      })
      .withDefault('')
  );

  const [genderFilter, setGenderFilter] = useQueryState(
    'gender',
    searchParams.gender.withOptions({
      shallow: true,
      throttleMs: 500
    }).withDefault('')
  );

  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withOptions({
        shallow: true
    }).withDefault(1)
  );

  useEffect(() => {
    console.log('Updating filters with:', { searchQuery, genderFilter, page });
    updateFilters({
      q: searchQuery || undefined,
      gender: genderFilter || undefined,
      page: page || undefined
    });
  }, [genderFilter, searchQuery, page, updateFilters]);

  // Xử lý đặc biệt cho gender filter
  const handleGenderFilter = useCallback((value: string | null) => {
    if (value === 'null') {
      setGenderFilter('null');
    } else {
      setGenderFilter(value);
    }
  }, [setGenderFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setGenderFilter(null);
  }, [setSearchQuery, setGenderFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!genderFilter;
  }, [searchQuery, genderFilter]);

  return {
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter: handleGenderFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive
  };
}