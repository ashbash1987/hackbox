export interface Member {
  id: string;
  name: string;
}

export interface PrivateRoomState {
  members: { [id: string]: Member };
}

export interface Component {
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
  };
  main: {
    background: string;
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

export interface MemberState {
  version: number;
  theme: ThemeState;
  ui: UiState;
  presets?: { [key: string]: Component };
}
