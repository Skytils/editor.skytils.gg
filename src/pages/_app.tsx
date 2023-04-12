import type { ColorScheme } from '@mantine/core'
import { getCookie } from 'cookies-next'
import type { AppContext, AppProps } from 'next/app'
import NextApp from 'next/app'
import Head from 'next/head'

import AppLayout from '@/components/layout'

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps, colorScheme } = props

  return (
    <>
      <Head>
        <title>Skytils Editor</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <AppLayout defaultColorScheme={colorScheme}>
        <Component {...pageProps} />
      </AppLayout>
    </>
  )
}

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'light',
  }
}
