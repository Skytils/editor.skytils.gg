import {
  Button,
  NumberInput,
  Paper,
  PasswordInput,
  SimpleGrid,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { createStyles } from '@mantine/styles';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

import * as constants from '@/constants';
import type { HostOptions } from '@/types';

const useStyles = createStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '85vh',
    height: 'fit-content',
  },
}));

export default function Home() {
  const { classes } = useStyles();
  const [hostOptions, setHostOptions] = useState<HostOptions>(
    constants.DEFAULT_HOST_OPTIONS,
  );

  useEffect(() => {
    const cookie = getCookie('HostOptions');
    if (!cookie) {
      setCookie('HostOptions', JSON.stringify(constants.DEFAULT_HOST_OPTIONS), {
        maxAge: 60 * 60 * 24 * 30,
      });
    }
    if (typeof cookie === 'string') {
      setHostOptions(JSON.parse(cookie));
      console.log(JSON.parse(cookie));
    }
  }, []);

  const handleSave = () => {
    setCookie('HostOptions', JSON.stringify(hostOptions), {
      maxAge: 60 * 60 * 24 * 30,
    });
    notifications.show({
      title: 'Success',
      message: 'Host options saved successfully.',
      autoClose: 7500,
      color: 'green',
    });
  };

  return (
    <div className={classes.container}>
      <Title align={'center'} py={25}>
        Skytils Editor Settings
      </Title>
      <Paper shadow="md" p="md" withBorder={true} w={'50%'}>
        <Title order={3}>Host Options</Title>
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: '62rem', cols: 3, spacing: 'md' },
            { maxWidth: '48rem', cols: 2, spacing: 'sm' },
            { maxWidth: '36rem', cols: 1, spacing: 'sm' },
          ]}
        >
          <TextInput
            label={'Host'}
            value={hostOptions.host}
            onChange={(e) =>
              setHostOptions({
                ...hostOptions,
                host: e.currentTarget.value,
              })
            }
          />
          <NumberInput
            label={'Port'}
            value={hostOptions.port}
            onChange={(e) =>
              setHostOptions({
                ...hostOptions,
                port: e as number,
              })
            }
          />
          <PasswordInput
            label={'Password'}
            value={hostOptions.password}
            onChange={(e) =>
              setHostOptions({
                ...hostOptions,
                password: e.currentTarget.value,
              })
            }
          />
        </SimpleGrid>
        <Button mt={15} onClick={handleSave}>
          Save
        </Button>
      </Paper>
    </div>
  );
}
