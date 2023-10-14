import { Conetext } from '@/components/context';
import './globals.css';
import '@mantine/core/styles.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI assistant',
  description: 'helpful ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Conetext>{children}</Conetext>
      </body>
    </html>
  );
}
