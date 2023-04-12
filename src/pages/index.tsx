import { Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { createStyles } from '@mantine/styles';

import { EDITOR_LINKS } from '@/constants';

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

  return (
    <div className={classes.container}>
      <Title align={'center'} py={25}>
        Skytils Editor
      </Title>
      <Paper p="md" w={'50%'}>
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: '36rem', cols: 1, spacing: 'sm' }]}
        >
          {EDITOR_LINKS.map((link, _) => (
            <Paper
              key={_}
              shadow="md"
              p="md"
              withBorder={true}
              component={'a'}
              href={link.route}
            >
              <Title order={3}>{link.name}</Title>
              <Text>{link.description}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Paper>
    </div>
  );
}
