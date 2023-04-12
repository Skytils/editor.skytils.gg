import type { ColorScheme } from '@mantine/core'
import { AppShell, ColorSchemeProvider, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { setCookie } from 'cookies-next'
import React from 'react'
import { useState } from 'react'

import LayoutFooter from '@/components/layout/footer'
import LayoutHeader from '@/components/layout/header'

export default function AppLayout({
  children,
  defaultColorScheme,
}: {
  children: React.ReactNode
  defaultColorScheme: ColorScheme
}) {
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(defaultColorScheme)

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark')
    setColorScheme(nextColorScheme)
    // when color scheme is updated save it to cookie
    setCookie('mantine-color-scheme', nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme,
        }}
      >
        <ModalsProvider>
          <Notifications />
          <AppShell
            padding={'md'}
            navbarOffsetBreakpoint={1270}
            fixed={false}
            header={
              <LayoutHeader
                colorScheme={colorScheme}
                toggleColorScheme={toggleColorScheme}
              />
            }
            footer={<LayoutFooter />}
          >
            {children}
          </AppShell>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}
