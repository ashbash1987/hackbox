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
