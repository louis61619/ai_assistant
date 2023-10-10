'use client';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import React, { useState } from 'react';
import { Notifications } from '@mantine/notifications';

export const Conetext = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorSchema] = useState<ColorScheme>('light');

  const toggleColorScheme = (value: ColorScheme) => {
    setColorSchema(value || colorScheme === 'dark' ? 'light' : 'dark');
  };
  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme, primaryColor: 'green' }} withNormalizeCSS withGlobalStyles>
        <Notifications position="top-right" zIndex={999}></Notifications>
        {children}
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
