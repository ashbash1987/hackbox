export interface Member {
  id: string;
  name: string;
}

interface MemberMap {
  [id: string]: Member;
}

export interface HostState {
  members: MemberMap;
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

export interface MemberState {
  theme: ThemeState;
  ui: UiState;
  presets?: { [key: string]: Component };
}
