import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import QueryProvider from '../components/providers/query-provider';
import { Toaster } from '../components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  applicationName: 'ApplyFlow',
  title: {
    default: 'ApplyFlow',
    template: '%s | ApplyFlow',
  },
  description: 'Track job applications, monitor progress, and stay organized in one place.',
  appleWebApp: {
    capable: true,
    title: 'ApplyFlow',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [{ url: '/applyflow-icon.svg', type: 'image/svg+xml' }],
    shortcut: '/applyflow-icon.svg',
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#1D1C25',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans'
      )}
    >
      <body className="min-h-dvh flex flex-col">
        <QueryProvider>{children}</QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
