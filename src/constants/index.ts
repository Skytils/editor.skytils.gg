import type { EditorLink, HostOptions } from '@/types';

const DEFAULT_HOST_OPTIONS: HostOptions = {
  host: 'localhost',
  port: 56969,
};

const EDITOR_LINKS: EditorLink[] = [
  {
    name: 'Waypoint Editor',
    description: 'A web-based editor for creating waypoints in-game.',
    route: '/waypoints',
  },
];

export { DEFAULT_HOST_OPTIONS, EDITOR_LINKS };
