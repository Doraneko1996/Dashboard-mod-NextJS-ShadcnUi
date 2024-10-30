'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, MoreHorizontal, Pen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Admin } from "@/types/admin";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-header";

const EmptyCell = ({ 
    variant = 'warning' 
}: { 
    variant?: 'warning' | 'destructive' 
}) => (
    <div className={cn(
        "flex items-center",
        variant === 'warning' ? "text-warning" : "text-destructive"
    )}>
        <AlertCircle className="h-4 w-4 mr-1" />
        <span>Trống</span>
    </div>
);

const renderCell = (value: any, variant: 'warning' | 'destructive' = 'warning') => {
    if (!value || value.trim() === '') {
        return <EmptyCell variant={variant} />;
    }
    return value;
};

export const columns: ColumnDef<Admin>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'first_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Họ" />
        ),
        cell: ({ row }) => renderCell(row.getValue('first_name'))
    },
    {
        accessorKey: 'last_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tên" />
        ),
        cell: ({ row }) => renderCell(row.getValue('last_name'))
    },
    {
        accessorKey: 'user_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Tài khoản" />
        ),
        cell: ({ row }) => renderCell(row.getValue('user_name'))
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => renderCell(row.getValue('email'))
    },
    {
        accessorKey: 'phone_number',
        header: 'Liên hệ',
        cell: ({ row }) => renderCell(row.getValue('phone_number'), 'destructive')
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        cell: ({ row }) => renderCell(row.getValue('address'))
    },
    {
        accessorKey: 'district',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Quận/Huyện" />
        ),
        cell: ({ row }) => renderCell(row.getValue('district'))
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const router = useRouter();

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/manage/admin/${row.original.id}`)}
                        >
                            <Pen className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4" /> Xóa bỏ
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
];