import { Flex, Paper, Stack, Text, Title } from '@mantine/core';

import useStyles from './adblocker.styles';

export default function AdBlockerNotice() {
  const { classes } = useStyles();
  return (
    <Paper
      className={classes.root}
      shadow="md"
      p="md"
      withBorder={true}
      w={'fit-content'}
      mih={'fit-content'}
    >
      <Stack spacing={'0'} justify={'flex-start'}>
        <Title order={3} mb={'0'}>
          Notice!
        </Title>
        <Flex>
          <Text>
            If you have an adblocker enabled, you will need to disable it in
            order for this platform to work.
          </Text>
        </Flex>
      </Stack>
    </Paper>
  );
}
