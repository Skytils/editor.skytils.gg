import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';

import AppLayout from '@/components/layout';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [adBlockerNotice, setAdBlockerNotice] = useState(true);

  return (
    <>
      <Head>
        <title>Skytils Editor</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </>
  );
}
