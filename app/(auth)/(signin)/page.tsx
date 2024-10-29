import { Metadata } from 'next';
import LoginViewPage from '../_components/login-view';

export const metadata: Metadata = {
  title: 'GEMS | Đăng nhập',
  description: 'GEMS đăng nhập vào hệ thống.'
};

export default function Page() {
  return <LoginViewPage />;
}
