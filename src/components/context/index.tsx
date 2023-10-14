'use client';
import { MantineProvider, MantineColorScheme, createTheme, ActionIcon } from '@mantine/core';
import React, { useState } from 'react';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'transparent',
        color: 'gray',
      },
    }),
  },
  // primaryColor: 'gray',
  // primaryShade: 6,
});

export const Conetext = ({ children }: { children: React.ReactNode }) => {
  const [MantineColorScheme, setColorSchema] = useState<MantineColorScheme>('light');

  // const toggleMantineColorScheme = (value: MantineMantineColorScheme) => {
  //   setColorSchema(value || MantineColorScheme === 'dark' ? 'light' : 'dark');
  // };
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications position="top-right" zIndex={999}></Notifications>
      {children}
    </MantineProvider>
  );
};
