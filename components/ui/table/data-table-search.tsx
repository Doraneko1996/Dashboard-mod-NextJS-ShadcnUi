'use client';

import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
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
  // Local state để hiển thị ngay khi gõ
  const [inputValue, setInputValue] = useState(searchQuery ?? '');

  // Sync inputValue khi searchQuery thay đổi (ví dụ: khi reset)
  useEffect(() => {
    setInputValue(searchQuery ?? '');
  }, [searchQuery]);

  // Debounce việc gọi API
  const debouncedSearch = useDebounce(
    (value: string) => {
      if (value.length >= minLength || value === '') {
        setSearchQuery(value);
      }
    },
    500 // Đợi 500ms sau khi ngừng gõ
  );

  return (
    <Input
      placeholder={`Tìm kiếm ${searchKey}...`}
      value={inputValue}
      onChange={(e) => {
        const value = e.target.value;
        setInputValue(value);     // Cập nhật UI ngay
        debouncedSearch(value);   // Chờ 500ms mới gọi API
      }}
      className="w-full md:max-w-[200]"
    />
  );
}