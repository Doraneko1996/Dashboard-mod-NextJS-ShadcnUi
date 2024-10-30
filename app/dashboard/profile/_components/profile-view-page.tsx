'use client';

import PageContainer from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountBasic from './account-basic';
import AccountDetail from './account-detail';

export default function ProfileViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Cài đặt tài khoản
        </h2>

        <Tabs defaultValue="account-basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account-basic">
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="account-advanced">
              Thông tin chi tiết
            </TabsTrigger>
            <TabsTrigger value="change-password">
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account-basic" className="space-y-4">
            <AccountBasic />
          </TabsContent>
          <TabsContent value="account-advanced" className="space-y-4">
            <AccountDetail />
          </TabsContent>
          <TabsContent value="change-password" className="space-y-4">
            {/* Nội dung cho phần đổi mật khẩu */}
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
