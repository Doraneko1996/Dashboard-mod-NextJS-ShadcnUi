import type { ColumnDef, SortingState } from '@tanstack/react-table';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems?: number;
  onSortingChange?: (sorting: SortingState) => void;
  loading?: boolean;
  onRefresh?: () => void;
  pageSizeOptions?: number[];
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}