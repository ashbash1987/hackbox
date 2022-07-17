export interface Component {
  key: string;
  type: string;
  props: { [key: string]: unknown };
}

export interface ThemeState {
  header: {
    color: string;
    background: string;
  };
  main: {
    background: string;
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

export interface PlayerStatePayload {
  theme: ThemeState;
  ui: UiState;
  presets: { [key: string]: Component };
}
