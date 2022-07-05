export interface Component {
  key: string;
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
  }
}

export interface UiState {
  header: {
    text: string;
  },
  main: {
    align: "start" | "center" | "end";
    components: Component[] | null,
  },
}

export interface PlayerState {
  theme: ThemeState;
  ui: UiState;
}
