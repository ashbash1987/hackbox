export interface Buzz {
  playerId: string;
  timestamp: number;
  localSpeed: number;
  value: string;
}

export interface Player {
  id: string;
  name: string;
  locked: boolean;
  score: number;
  team?: string;
}

export interface Team {
  color: string;
  name: string;
  members: string[];
}

export interface Choice {
  value: string;
  label: string;
  keys: string[];
}

export interface GameState {
  players: {
    [id: string]: Player;
  };
  teams: { [key: string]: Team };
  buzzer: {
    component: {
      type: string;
      choices?: Choice[];
    };
    buzzes: { [playerId: string]: Buzz };
  };
}
