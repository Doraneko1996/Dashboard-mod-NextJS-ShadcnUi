'use client';

import Image from 'next/image';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import {
  Bell,
  ChevronRight,
  ChevronUp,
  LogOut,
  UserCog
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import GEMSIcon from '@/public/images/GEMS-icon.svg';
import SearchInput from '../search-input';
import ThemeToggle from './ThemeToggle/theme-toggle';
import { useEffect, useState } from 'react';
import { NavItem } from '@/types';
import { logoutAction } from '@/app/actions/auth';
import { useAuth } from '@/contexts/auth-context';

// Thông tin công ty
export const company = {
  name: 'GEMS E-Learning',
  logo: GEMSIcon,
  plan: 'Tin học quốc tế'
};

export default function AppSidebar({
  children
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { user, clearUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const result = await logoutAction();

      if (result.success) {
        router.push('/');
        clearUser(); // Xóa user từ context
        toast.success('Đăng xuất thành công', {
          description: 'Hẹn gặp lại sau nhé!'
        });
      } else if (result.error) {
        toast.error('Đăng xuất thất bại', {
          description: result.error
        });
      }
    } catch (error) {
      toast.error('Đăng xuất thất bại', {
        description: 'Đã xảy ra lỗi server trong quá trình đăng xuất.'
      });
    }
  };

  // Không render gì nếu component chưa được mount
  if (!mounted) return null;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Header của sidebar */}
        <SidebarHeader>
          <div className="flex gap-2 py-2 text-sidebar-accent-foreground">
            {/* Logo công ty */}
            <div className="flex aspect-square size-8 items-center justify-center border rounded-md bg-sidebar-primary text-sidebar-primary-foreground bg-transparent dark:bg-white">
              <Image
                src={company.logo}
                alt="GEMS Icon"
                width={16}
                height={16}
                className="size-6"
                priority
              />
            </div>
            {/* Tên và mô tả công ty */}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
              <span className="truncate text-xs">{company.plan}</span>
            </div>
          </div>
        </SidebarHeader>

        {/* Nội dung chính của sidebar */}
        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarMenu>
              {/* Map qua danh sách menu items */}
              {navItems.map((item: NavItem) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.logo;
                // Xử lý menu item có submenu
                return item?.items && item?.items?.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={pathname === item.url}
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {/* Submenu items */}
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem: any) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  // Menu item đơn giản không có submenu
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer của sidebar - Thông tin user */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
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
                        src={user?.image || ''}
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
                          src={user?.image || ''}
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Phần nội dung chính của trang */}
      <SidebarInset>
        {/* Header của phần nội dung */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger
              className="-ml-1"
              onClick={() => {
                // Đợi animation hoàn thành
                setTimeout(() => {
                  window.dispatchEvent(new Event('sidebar-resize'));
                }, 200);
              }}
            />
          </div>
          {/* Thanh tìm kiếm */}
          <div className="hidden w-1/3 items-center gap-2 px-4 md:flex">
            <SearchInput />
          </div>
          {/* Nút chuyển đổi theme */}
          <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>
        {/* Nội dung chính */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
