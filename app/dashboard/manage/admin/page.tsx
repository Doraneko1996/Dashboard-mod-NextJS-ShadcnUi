'use client';

import AdminTable from './_components/admin-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import PageContainer from '@/components/layout/page-container';
import { AdminsProvider, useAdminsContext } from './_components/hooks/admins-context';

export default function AdminsPage() {
    return (
        <AdminsProvider>
            <PageContainer scrollable>
                <AdminsPageContent />
            </PageContainer>
        </AdminsProvider>
    );
}

function AdminsPageContent() {
    const { total = 0 } = useAdminsContext();

    return (
        <div className="space-y-4">
            <div className="flex items-start justify-between">
                <Heading
                    title="Admin"
                    status={total}
                    description="Quản lý admin trong hệ thống"
                />

                <Link href="/dashboard/manage/admin/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Thêm admin
                    </Button>
                </Link>
            </div>

            <Separator />

            <AdminTable />
        </div>
    );
}