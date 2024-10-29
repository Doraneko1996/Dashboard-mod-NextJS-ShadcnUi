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

// Helper function để render cell với warning icon nếu trống
const renderCellWithWarning = (value: any) => {
    if (!value || value.trim() === '') {
        return (
            <div className="flex items-center text-warning">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Trống</span>
            </div>
        );
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
        header: 'Họ',
        cell: ({ row }) => renderCellWithWarning(row.getValue('first_name'))
    },
    {
        accessorKey: 'last_name',
        header: 'Tên',
        cell: ({ row }) => renderCellWithWarning(row.getValue('last_name'))
    },
    {
        accessorKey: 'user_name',
        header: 'Tên tài khoản',
        cell: ({ row }) => renderCellWithWarning(row.getValue('user_name'))
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => renderCellWithWarning(row.getValue('email'))
    },
    {
        accessorKey: 'phone_number',
        header: 'Số điện thoại',
        cell: ({ row }) => renderCellWithWarning(row.getValue('phone_number'))
    },
    {
        accessorKey: 'address',
        header: 'Địa chỉ',
        cell: ({ row }) => renderCellWithWarning(row.getValue('address'))
    },
    {
        accessorKey: 'district',
        header: 'Quận/Huyện',
        cell: ({ row }) => renderCellWithWarning(row.getValue('district'))
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