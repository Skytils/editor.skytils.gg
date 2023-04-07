import type { HostOptions, ApiResponse, WaypointCategory } from "@/types"

import * as constants from "@/constants"

import { useState } from "react"
import axios from "axios"
import {Paper, SimpleGrid, TextInput, NumberInput, PasswordInput, Title} from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from '@mantine/notifications';
import { createStyles } from "@mantine/styles"

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

    const makeRequest = (method: "GET" | "POST" | "PUT", body?: Record<any, any>) => {
        if (!hostOptions.password) {
            return notifications.show({
                title: "Error",
                message: "You must enter a password to connect to the server.",
                autoClose: 10000
            })
        }
        return axios.request({
            method,
            headers: {
                "Authorization": `Basic ${Buffer.from(`skytilseditor:${hostOptions.password}`).toString("base64")}`,
            },
            url: `http://${hostOptions.host}:${hostOptions.port}`,
            data: body
        })
            .then((res) => {
                setWaypoints(res.data)
            })
            .catch((err) => {
                notifications.show({
                    title: "Error",
                    message: err.response?.data?.error || "An unknown error occurred.",
                    autoClose: 10000
                })
            })
    }

    return (
        <div className={classes.container}>
            <Title align={"center"} py={25}>Skytils Waypoint Editor</Title>

        </div>
    )
}
