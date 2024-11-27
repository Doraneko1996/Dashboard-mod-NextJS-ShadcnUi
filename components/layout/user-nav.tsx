'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Bell,
    ChevronUp,
    LogOut,
    UserCog
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';
import { logoutAction } from '@/services/auth';
import { toast } from 'sonner';

export function UserNav() {
    const { user, clearUser } = useAuth();

    // Xử lý đăng xuất
    const handleLogout = async () => {
        const result = await logoutAction();
        if (result.success) {
            sessionStorage.removeItem('user');
            clearUser();
            toast.success('Đăng xuất thành công');
        } else {
            toast.error('Đăng xuất thất bại', {
                description: result.error
            });
        }
    };

    if (user) {
        return (
            <DropdownMenu>
                {/* Trigger cho dropdown menu */}
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        {/* Avatar user */}
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                // src={user?.image || ''}
                                alt={user?.first_name || ''}
                                loading="lazy"
                            />
                            <AvatarFallback className="rounded-lg">
                                {((user?.first_name?.[0] ?? '') + (user?.last_name?.[0] ?? '')) || ''}
                            </AvatarFallback>
                        </Avatar>
                        {/* Thông tin user */}
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {user ? `${user.first_name} ${user.last_name}` : ''}
                            </span>
                            <span className="truncate text-xs">
                                {user?.user_name || ''}
                            </span>
                        </div>
                        <ChevronUp className="ml-auto size-4" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>

                {/* Nội dung dropdown menu */}
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                >
                    {/* Label hiển thị thông tin user */}
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    // src={user?.image || ''}
                                    alt={user?.first_name || ''}
                                    loading="lazy"
                                />
                                <AvatarFallback className="rounded-lg">
                                    {((user?.first_name?.[0] ?? '') + (user?.last_name?.[0] ?? '')) || ''}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user ? `${user.first_name} ${user.last_name}` : ''}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.user_name || ''}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Các menu items */}
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Bell className="mr-2" />
                            Thông báo
                            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile">
                                <UserCog className="mr-2" />
                                Cài đặt tài khoản
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {/* Nút đăng xuất */}
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2" />
                        Đăng xuất
                        <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}