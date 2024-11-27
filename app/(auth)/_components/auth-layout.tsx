'use client';

import Image from 'next/image';
import GEMSLogo from '@/public/images/GEMS-logo.svg';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AuthLayout({ 
  children,
  title = 'Hệ thống dạy học và ôn luyện tin học quốc tế trực tuyến'
}: AuthLayoutProps) {
  const { status } = useSession();

  useEffect(() => {
    // Logic hiển thị toast khi đăng xuất
    const urlParams = new URLSearchParams(window.location.search);
    if (status === 'unauthenticated') {
      if (urlParams.get('logout') === 'true') {
        toast.success('Đăng xuất thành công');
      } else if (urlParams.get('error') === 'token_expired') {
        toast.error('Phiên đăng nhập đã hết hạn', {
          description: 'Vui lòng đăng nhập lại'
        });
      }
    }
    window.history.replaceState({}, '', window.location.pathname);
  }, [status]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      {/* Header với logo */}
      <div className="absolute top-0 w-full flex flex-col items-center">
        <span className="flex w-full items-center justify-center dark:bg-white">
          <Image
            style={{ width: 'auto', height: '70px' }}
            src={GEMSLogo}
            alt="GEMS Logo"
            priority
          />
        </span>
        <h1 className="text-sm md:text-2xl font-semibold mt-2">
          {title}
        </h1>
      </div>

      {/* Content */}
      <div className="w-full max-w-[400px] px-4">
        {children}
      </div>
    </div>
  );
}