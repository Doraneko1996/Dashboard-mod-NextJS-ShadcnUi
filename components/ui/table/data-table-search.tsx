'use client';

import { Input } from '@/components/ui/input';

interface DataTableSearchProps {
  searchKey: string;
  searchQuery?: string;
  setSearchQuery: (value: string) => void;
}

export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
}: DataTableSearchProps) {
  return (
    <Input
      placeholder={`Tìm kiếm ${searchKey}...`}
      value={searchQuery ?? ''}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full md:max-w-sm"
    />
  );
}
