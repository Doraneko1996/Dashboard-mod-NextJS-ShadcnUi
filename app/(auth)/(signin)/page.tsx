import { Metadata } from 'next';
import { AuthLayout } from '../_components/auth-layout';
import LoginForm from '../_components/auth-form';

export const metadata: Metadata = {
  title: 'GEMS | Đăng nhập',
  description: 'GEMS đăng nhập vào hệ thống.'
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
