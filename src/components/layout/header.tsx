import { ActionIcon, Group, Header, UnstyledButton } from '@mantine/core'
import { IconMoonStars, IconSettings, IconSun } from '@tabler/icons-react'
import Image from 'next/image'

import useStyles from './header.styles'

export default function LayoutHeader({
  colorScheme,
  toggleColorScheme,
}: {
  colorScheme: 'dark' | 'light'
  toggleColorScheme: () => void
}) {
  const { classes } = useStyles()

  return (
    <Header height={80} p={10} className={classes.root}>
      <UnstyledButton component={'a'} href={'/'}>
        <Image
          src={'/../public/logo.png'}
          alt={'Skytils Logo'}
          width={64}
          height={64}
          className={classes.icon}
        />
      </UnstyledButton>
      <Group>
        <ActionIcon onClick={() => toggleColorScheme()} size={'lg'}>
          {colorScheme === 'dark' ? <IconMoonStars /> : <IconSun />}
        </ActionIcon>
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
  )
}
