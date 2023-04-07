import {Paper, SimpleGrid, TextInput, NumberInput, PasswordInput, Title} from "@mantine/core"
import { createStyles } from "@mantine/styles"
import { notifications } from '@mantine/notifications';


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

    return (
        <div className={classes.container}>
            <Title align={"center"} py={25}>Skytils Editor</Title>

        </div>
    )
}
