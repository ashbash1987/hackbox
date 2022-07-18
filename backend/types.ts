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

export interface MemberState {
  theme: ThemeState;
  ui: UiState;
  presets?: { [key: string]: Component };
}
