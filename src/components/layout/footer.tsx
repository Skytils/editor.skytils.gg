import { Footer, Text } from '@mantine/core';

import useStyles from './footer.styles';

export default function LayoutFooter() {
  const { classes } = useStyles();

  return (
    <Footer height={30}>
      <div className={classes.text}>
        <Text size={'sm'}>
          © {new Date().getFullYear()}{' '}
          <a
            className={classes.anchorTag}
            href={'https://github.com/skytils'}
            target="_blank"
            rel="noopener noreferrer"
          >
            Skytils Software
          </a>{' '}
          - Made with ❤️ by{' '}
          <a
            className={classes.anchorTag}
            href={'https://github.com/tonydawhale'}
            target="_blank"
            rel="noopener noreferrer"
          >
            tonydawhale
          </a>
        </Text>
      </div>
    </Footer>
  );
}
