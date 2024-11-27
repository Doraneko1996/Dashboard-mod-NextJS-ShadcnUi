'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthentication } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isLoading, error } = useAuthentication();
  
    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          document.cookie = 'auth_redirect=true; path=/';
          router.replace('/');
        } else if (error?.message === 'Phiên đăng nhập đã hết hạn') {
          toast.error('Phiên đăng nhập đã hết hạn', {
            description: 'Vui lòng đăng nhập lại'
          });
          router.replace('/');
        }
      }
    }, [user, isLoading, error, router]);
  
    if (isLoading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }
  
    if (!user) return null;
  
    return <>{children}</>;
  }