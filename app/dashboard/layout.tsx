import AppSidebar from '@/components/layout/app-sidebar';
import type { Metadata } from 'next';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/layout/header';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'GEMS E-Learning | Dashboard',
  description: 'Hệ thống dạy học và ôn luyện tin học quốc tế trực tuyến'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Lưu trạng thái đóng mở của sidebar trong cookie.
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {/* Nội dung chính của trang */}
        {children}
        {/* Kết thúc nội dung chính của trang */}
      </SidebarInset>
    </SidebarProvider>
  );
}