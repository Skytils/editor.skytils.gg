import { ActionIcon, Group, Header, UnstyledButton } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import Image from 'next/image';

import logo from '@/../public/logo.png';

import useStyles from './header.styles';

export default function LayoutHeader() {
  const { classes } = useStyles();

  return (
    <Header height={80} p={10} className={classes.root}>
      <UnstyledButton component={'a'} href={'/'}>
        <Image
          src={logo}
          alt={'Skytils Logo'}
          width={64}
          height={64}
          className={classes.icon}
        />
      </UnstyledButton>
      <Group>
        <ActionIcon
          size={'lg'}
          component={'a'}
          href={'/settings'}
          className={classes.settingsIcon}
        >
          <IconSettings />
        </ActionIcon>
      </Group>
    </Header>
  );
}
