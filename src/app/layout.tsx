'use client';
import './globals.css';
import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { useState } from 'react';
import { Notifications } from '@mantine/notifications';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI assistant',
  description: 'helpful AI assistant',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorSchema] = useState<ColorScheme>('light');

  const toggleColorScheme = (value: ColorScheme) => {
    setColorSchema(value || colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider theme={{ colorScheme, primaryColor: 'green' }} withNormalizeCSS withGlobalStyles>
            <Notifications position="top-right" zIndex={999}></Notifications>
            {children}
          </MantineProvider>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
