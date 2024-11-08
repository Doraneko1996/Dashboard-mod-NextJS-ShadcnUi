import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import type { ColumnDef, Table } from '@tanstack/react-table';

interface DataTableBodyProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData, any>[];
}

export function DataTableBody<TData>({ 
  table, 
  columns 
}: DataTableBodyProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
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
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns.length}
            className="h-24 text-center"
          >
            Không có dữ liệu.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
} 