import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import SearchInput from '../search-input';
import ThemeToggle from './ThemeToggle/theme-toggle';

export default function Header() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
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
    );
}