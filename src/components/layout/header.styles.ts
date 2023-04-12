import { createStyles } from '@mantine/core'

export default createStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    '&:hover': {
      transform: 'translateY(-1px)',
    },
  },
  settingsIcon: {
    '&:hover': {
      transition: 'rotate(90deg) 1s',
    },
  },
}))
