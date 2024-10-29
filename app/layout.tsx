import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${roboto.className}`}
      suppressHydrationWarning={true}
    >
      <body className={'overflow-hidden'}>
        <NextTopLoader showSpinner={false} />
        <Providers>
          <Toaster richColors theme="dark" />
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
