import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ScrollArea, ScrollBar } from '../scroll-area';

export function DataTableSkeleton({
  columnCount = 1,
  rowCount = 10,
}) {
  return (
    <div id="data-table-container" className="space-y-4">
      <ScrollArea className="rounded-md border">
        <div className="py-2 xl:pl-2">
          <Table className="relative">
            <TableHeader className="text-xs font-medium">
              <TableRow>
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({ length: columnCount }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between gap-2 py-4">
        <div className="flex-none">
          <Skeleton className="h-4 w-[70px]" />
        </div>
        <div className="flex-none min-w-[120px] text-center">
          <Skeleton className="h-5 w-full" />
        </div>
        <div className="flex-none flex items-center gap-2">
          <Skeleton className="hidden h-4 w-8 lg:flex" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="hidden h-4 w-8 lg:flex" />
        </div>
      </div>
    </div>
  );
}