import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'NADARI - Premium Optics & Stylist',
  description: 'Experience luxury eyewear and individualized fitting in Agdal, Rabat.',
  manifest: '/manifest.json',
};

import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute left-[-12rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.2),transparent_68%)] blur-3xl" />
            <div className="absolute right-[-8rem] top-[10rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(36,25,21,0.12),transparent_65%)] blur-3xl" />
            <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(217,200,180,0.28),transparent_68%)] blur-3xl" />
          </div>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
