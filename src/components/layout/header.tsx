import type {ColorScheme} from "@mantine/core";

import useStyles from "./header.styles";

import { Header, UnstyledButton, Group, ActionIcon } from "@mantine/core";
import { IconSun, IconMoonStars, IconSettings } from '@tabler/icons-react';
import Image from "next/image";

export default function LayoutHeader({colorScheme, setColorScheme}: {colorScheme: "dark" | "light", setColorScheme: (val: (((prevState: ColorScheme) => ColorScheme) | ColorScheme)) => void}) {
    const {classes} = useStyles();

    return (
        <Header
            height={80}
            p={10}
            className={classes.root}
        >
            <UnstyledButton
                component={"a"}
                href={"/"}
            >
                <Image
                    src={"/../public/logo.png"}
                    alt={"Skytils Logo"}
                    width={64}
                    height={64}
                    className={classes.icon}
                />
            </UnstyledButton>
            <Group>
                <ActionIcon
                    onClick={() => setColorScheme((prev) => prev === "dark" ? "light" : "dark")}
                    size={"lg"}
                >
                    {colorScheme === "dark" ? <IconMoonStars/> : <IconSun/>}
                </ActionIcon>
                <ActionIcon
                    size={"lg"}
                    component={"a"}
                    href={"/settings"}
                    className={classes.settingsIcon}
                >
                    <IconSettings/>
                </ActionIcon>
            </Group>
        </Header>
    )
}
