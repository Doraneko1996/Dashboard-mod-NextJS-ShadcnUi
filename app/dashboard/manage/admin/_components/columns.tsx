'use client';

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { AlertCircle, MoreHorizontal, Pen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Admin } from "@/types/admin";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/ui/table/components/data-table-column-header";
import { memo, useState, useCallback } from "react";

const StatusCell = memo(({ row }: { row: Row<Admin> }) => {
    const status = row.getValue('status');
    const [isChecked, setIsChecked] = useState(status === 1);

    const handleChange = useCallback(async (checked: boolean) => {
        try {
            setIsChecked(checked);
            await handleStatusChange(row.original.id, checked);
        } catch (error) {
            // Nếu có lỗi, revert lại state
            setIsChecked(!checked);
            throw error;
        }
    }, [row.original.id]);

    return (
        <div className="flex items-center space-x-2">
            <Switch
                checked={isChecked}
                onCheckedChange={handleChange}
                className={cn(
                    "!bg-green-500",
                    !isChecked && "!bg-zinc-500"
                )}
            />
            <span className={cn(
                "text-xs font-medium",
                isChecked ? "text-green-500" : "text-muted-foreground"
            )}>
                {isChecked ? 'Mở' : 'Khóa'}
            </span>
        </div>
    );
});

StatusCell.displayName = 'StatusCell';

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

// Thêm hàm xử lý cập nhật trạng thái
const handleStatusChange = async (id: number, checked: boolean) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: checked
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Cập nhật trạng thái thất bại.');
        }

        toast.success('Cập nhật thành công', {
            description: result.message
        });

    } catch (error: any) {
        toast.error('Cập nhật thất bại', {
            description: error.message || 'Đã có lỗi xảy ra khi cập nhật trạng thái.'
        });
    }
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
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Trạng thái" />
        ),
        cell: ({ row }) => <StatusCell row={row} />
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