export interface Player {
  id: string;
  name: string;
}

export interface Component {
  type: string;
  props: { [key: string]: unknown };
}

export interface ThemeState {
  backgroundColor: string;
}

export interface DisplayState {
  components?: Component[];
}

export interface PlayerState {
  theme: ThemeState;
  display: DisplayState;
}

interface PlayerMap {
  [id: string]: Player
}

export interface HostState {
  players: PlayerMap;
  messages: unknown[];
}
