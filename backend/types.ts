export interface Player {
  id: string;
  name: string;
}

interface PlayerMap {
  [id: string]: Player;
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
    textColor: string;
    backgroundColor: string;
  };
  main: {
    backgroundColor: string;
  };
}

export interface UiState {
  header: {
    text: string;
  };
  main: {
    align: "start" | "center" | "end";
    components: Component[];
  };
}

export interface PlayerState {
  theme: ThemeState;
  ui: UiState;
}
