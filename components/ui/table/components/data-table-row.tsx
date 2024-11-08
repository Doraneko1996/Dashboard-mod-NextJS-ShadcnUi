import { TableCell, TableRow } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import { memo } from 'react';

interface DataTableRowProps<TData> {
  row: Row<TData>;
}

export const DataTableRow = memo(function DataTableRow<TData>({ 
  row 
}: DataTableRowProps<TData>) {
  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          )}
        </TableCell>
      ))}
    </TableRow>
  );
});