import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  text: {
    textAlign: 'center',
    marginTop: '0.25rem',
  },
  anchorTag: {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    textDecoration: `underline`,
  },
}));
