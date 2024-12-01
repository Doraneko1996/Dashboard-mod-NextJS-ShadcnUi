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
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import { handleLogout } from '@/app/(auth)/actions';

export function UserNav() {
    const { data: session } = useSession();

    if(session) {        
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
                                src={session.user.image || ''}
                                alt={session.user.name || ''}
                                loading="lazy"
                            />
                            <AvatarFallback className="rounded-lg">
                                {(session.user.name?.[0] ?? '') || ''}
                            </AvatarFallback>
                        </Avatar>
                        {/* Thông tin user */}
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {session.user.name}
                            </span>
                            <span className="truncate text-xs">
                                {session.user.user_name}
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
                    <DropdownMenuItem onClick={() => handleLogout()}>
                        <LogOut className="mr-2" />
                        Đăng xuất
                        <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
}