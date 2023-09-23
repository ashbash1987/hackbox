export interface Component {
  key: string;
  type: string;
  props: { [key: string]: unknown };
}

export interface CustomFont {
  family: string;
}

export interface ThemeState {
  header: {
    color: string;
    background: string;
    fontFamily: string;
  };
  main: {
    background: string;
    fontFamily: string;
  };
  fonts?: CustomFont[];
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
  version: number;
  theme: ThemeState;
  ui: UiState;
}

export interface PlayerStatePayload {
  version?: number;
  theme: ThemeState;
  ui: UiState;
  presets: { [key: string]: Component };
}

export interface FindRoomResponse {
  exists: boolean;
  twitchRequired?: boolean;
}
