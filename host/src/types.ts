export interface Member {
  id: string;
  name: string;
  messages: [];
}

interface MemberMap {
  [id: string]: Member;
}

export interface Message {
  id: string;
  from: string;
  timestamp: number;
  message: { [key: string]: unknown };
}

export interface HostState {
  members: MemberMap;
  messages: Message[];
}

export interface Component {
  type: string;
  props: { [key: string]: object };
}

export interface ThemeState {
  header: {
    text: string;
    textColor: string;
    backgroundColor: string;
  };
  main: {
    backgroundColor: string;
  };
}

export interface ComponentsState {
  main: Component[];
}

export interface MemberState {
  theme: ThemeState;
  components: ComponentsState;
}
