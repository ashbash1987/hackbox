export interface Player {
  id: string;
  name: string;
}

interface PlayerMap {
  [id: string]: Player
}

export interface HostState {
  players: PlayerMap;
  messages: unknown[];
}

export interface Component {
  type: string;
  props: { [key: string]: unknown };
}

export interface ThemeState {
  header: {
    text: string;
    textColor: string;
    backgroundColor: string;
  };
  main: {
    backgroundColor: string;
  }
}

export interface ComponentsState {
  main: Component[];
}

export interface PlayerState {
  theme: ThemeState;
  components: ComponentsState;
}
