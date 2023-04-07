import type {HostOptions, WaypointCategory} from "@/types";
import * as constants from "@/constants";

import {useState} from "react";

import {createStyles} from "@mantine/styles";
import {useLocalStorage} from "@mantine/hooks";
import {NumberInput, Paper, PasswordInput, SimpleGrid, TextInput, Title, Button} from "@mantine/core";

const useStyles = createStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
    }
}))

export default function Home() {
    const {classes} = useStyles();
    const [hostOptions, setHostOptions] = useLocalStorage<HostOptions>(
        {
            key: "HostOptions",
            defaultValue: constants.DEFAULT_HOST_OPTIONS
        }
    )
    const [waypoints, setWaypoints] = useState<WaypointCategory[]>([])

    return (
        <div className={classes.container}>
            <Title align={"center"} py={25}>Skytils Editor Settings</Title>
            <Paper shadow="md" p="md" withBorder={true} w={"50%"}>
                <Title order={3}>Host Options</Title>
                <SimpleGrid cols={3}>
                    <TextInput
                        label={"Host"}
                        value={hostOptions.host}
                        onChange={(e) => setHostOptions({ ...hostOptions, host: e.currentTarget.value })}
                    />
                    <NumberInput
                        label={"Port"}
                        value={hostOptions.port}
                        onChange={(e) => setHostOptions({ ...hostOptions, port: e as number })}
                    />
                    <PasswordInput
                        label={"Password"}
                        value={hostOptions.password}
                        onChange={(e) => setHostOptions({ ...hostOptions, password: e.currentTarget.value })}
                    />
                </SimpleGrid>
            </Paper>
        </div>
    )
}
