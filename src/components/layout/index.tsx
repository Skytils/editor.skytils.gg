import type React from "react";
import type { ColorScheme } from "@mantine/core";

import LayoutHeader from "@/components/layout/header";

import { AppShell, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import {useLocalStorage} from "@mantine/hooks";

export default function AppLayout({children}: {children: React.ReactNode}) {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'color-scheme',
        defaultValue: 'dark',
    });

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                /** Put your mantine theme override here */
                colorScheme,
            }}
        >
            <Notifications/>
            <AppShell
                padding={"md"}
                navbarOffsetBreakpoint={1270}
                fixed={false}
                header={<LayoutHeader colorScheme={colorScheme} setColorScheme={setColorScheme}/>}
            >
                {children}
            </AppShell>
        </MantineProvider>
    )
}
