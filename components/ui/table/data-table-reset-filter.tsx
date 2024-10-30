'use client';
import { XIcon } from 'lucide-react';
import { Button } from '../button';

type DataTableResetFilterProps = {
  isFilterActive: boolean;
  onReset?: () => void;
};

export function DataTableResetFilter({
  isFilterActive,
  onReset
}: DataTableResetFilterProps) {
  if (!isFilterActive) return null;
  
  return (
    <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onReset}>
      <XIcon className="mr-2 h-4 w-4" />
      Đặt lại
    </Button>
  );
}
