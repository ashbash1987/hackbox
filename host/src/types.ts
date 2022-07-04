export interface SanitizedPlayer {
  id: string;
  socketId: string;
  name: string;
}

export interface Component {
  type: string;
  value: string;
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

export interface HostState {
  players: { [id: string]: SanitizedPlayer };
}
