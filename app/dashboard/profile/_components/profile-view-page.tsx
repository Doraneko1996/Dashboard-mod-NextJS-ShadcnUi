'use client';

import { useSession } from 'next-auth/react';
import PageContainer from '@/components/layout/page-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountBasic from './account-basic';
import AccountDetail from './account-detail';
import AccountChangePw from './account-changepw';

export default function ProfileViewPage() {
  const { data: session } = useSession();
  const isTeacher = session?.user?.role === 2;

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
            {isTeacher && (
              <TabsTrigger value="account-advanced">
                Thông tin chi tiết
              </TabsTrigger>
            )}
            <TabsTrigger value="change-password">
              Đổi mật khẩu
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account-basic" className="space-y-4">
            <AccountBasic />
          </TabsContent>
          {isTeacher && (
            <TabsContent value="account-advanced" className="space-y-4">
              <AccountDetail />
            </TabsContent>
          )}
          <TabsContent value="change-password" className="space-y-4">
            <AccountChangePw />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
