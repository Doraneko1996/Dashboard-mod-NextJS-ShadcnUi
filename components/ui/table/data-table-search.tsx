'use client';

import { Input } from '@/components/ui/input';
import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface DataTableSearchProps {
    searchKey: string;
    searchQuery?: string;
    setSearchQuery: (value: string) => void;
    minLength?: number;
}

export function DataTableSearch({
    searchKey,
    searchQuery,
    setSearchQuery,
    minLength = 2,
}: DataTableSearchProps) {
    const [inputValue, setInputValue] = useState(searchQuery ?? '');

    // Sync inputValue với searchQuery
    useEffect(() => {
        if (searchQuery !== inputValue) {
            setInputValue(searchQuery ?? '');
        }
    }, [searchQuery]);

    // Xử lý search với debounce
    const handleSearch = useCallback((value: string) => {
        if (value.length >= minLength || value === '') {
            setSearchQuery(value);
        }
    }, [minLength, setSearchQuery]);

    const debouncedSearch = useDebounce(handleSearch, 500);

    // Xử lý onChange
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);     // Cập nhật UI ngay
        debouncedSearch(value);   // Debounce search
    }, [debouncedSearch]);

    return (
        <Input
            placeholder={`Tìm kiếm ${searchKey}...`}
            value={inputValue}
            onChange={handleChange}
            className="w-full md:max-w-[200px]"
        />
    );
}