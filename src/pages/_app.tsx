import type { AppProps } from 'next/app';

import AppLayout from "@/components/layout";

import Head from 'next/head';

export default function App(props: AppProps) {
    const { Component, pageProps } = props;

    return (
        <>
            <Head>
                <title>Skytils Editor</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            </Head>

            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </>
    );
}
