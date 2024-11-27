import Providers from '@/components/layout/providers';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { auth } from '@/auth';

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
  const session = await auth()

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
          <SessionProvider 
            session={session}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
          >
            {children}
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
