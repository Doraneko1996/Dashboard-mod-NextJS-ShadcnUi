'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/hooks/useAuthentication';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user } = useAuthentication();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) {
        return (
            <div className="h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    return <>{children}</>;
} 