'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import GEMSLogo from '@/public/images/GEMS-logo.svg';
import UserLoginForm from './login-form';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.'
};

export default function LoginViewPage() {
  useEffect(() => {
    // Kiểm tra cookie redirect khi load trang login
    const cookies = document.cookie.split(';');
    const redirectCookie = cookies.find(cookie => cookie.trim().startsWith('auth_redirect='));

    if (redirectCookie) {
      // Xóa cookie
      document.cookie = 'auth_redirect=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Hiển thị thông báo
      toast.error('Truy cập bị từ chối', {
        description: 'Bạn cần đăng nhập để truy cập vào trang này!'
      });
    }
  }, []);
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="absolute top-0 w-full flex flex-col items-center">
        <span className="flex w-full items-center justify-center dark:bg-white">
          <Image
            style={{ width: 'auto', height: '70px' }}
            src={GEMSLogo}
            alt="GEMS Logo"
            priority
          />
        </span>
        <h1 className="text-2xl font-semibold mt-2">Hệ thống dạy học và ôn luyện tin học quốc tế trực tuyến</h1>
      </div>
      <UserLoginForm />
    </div>
  );
}
