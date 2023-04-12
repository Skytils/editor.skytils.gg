import { AppShell, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import React from 'react';

import LayoutFooter from '@/components/layout/footer';
import LayoutHeader from '@/components/layout/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'dark',
      }}
    >
      <ModalsProvider>
        <Notifications />
        <AppShell
          padding={'md'}
          navbarOffsetBreakpoint={1270}
          fixed={false}
          header={<LayoutHeader />}
          footer={<LayoutFooter />}
        >
          {children}
        </AppShell>
      </ModalsProvider>
    </MantineProvider>
  );
}
