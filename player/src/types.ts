export interface Component {
  type: string;
  props: { [key: string]: unknown };
}

export interface ThemeState {
  navbarColor: string;
  backgroundColor: string;
}

export interface DisplayState {
  components?: Component[];
}

export interface PlayerState {
  theme: ThemeState;
  display: DisplayState;
}
