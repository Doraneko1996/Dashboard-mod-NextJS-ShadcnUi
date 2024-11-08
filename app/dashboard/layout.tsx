import AppSidebar from '@/components/layout/app-sidebar';
import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/auth-guard';

export const metadata: Metadata = {
  title: 'GEMS E-Learning | Dashboard',
  description: 'Hệ thống dạy học và ôn luyện tin học quốc tế trực tuyến'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppSidebar>{children}</AppSidebar>
    </AuthGuard>
  );
}