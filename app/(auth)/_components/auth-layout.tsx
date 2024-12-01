'use client';

import Image from 'next/image';
import GEMSLogo from '@/public/images/GEMS-logo.svg';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function AuthLayout({
  children,
  title = 'Hệ thống dạy học và ôn luyện tin học quốc tế trực tuyến'
}: AuthLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('logout');

  useEffect(() => {
    const messages = {
      success: {
        type: 'success',
        title: 'Đăng xuất thành công',
        description: 'Hẹn gặp bạn lần sau.'
      },
      password_changed: {
        type: 'success',
        title: 'Đổi mật khẩu thành công',
        description: 'Vui lòng đăng nhập lại với mật khẩu mới.'
      }
    } as const;

    const messageConfig = messages[message as keyof typeof messages];
    if (messageConfig) {
      if (messageConfig.type === 'success') {
        toast.success(messageConfig.title, {
          description: messageConfig.description
        });
      } else {
        toast.warning(messageConfig.title, {
          description: messageConfig.description
        });
      }

      router.replace('/');
    }
  }, [message, router]);

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