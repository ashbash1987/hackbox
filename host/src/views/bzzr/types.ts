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
}

export interface Choice {
  value: string;
  label: string;
  keys: string[];
}

export interface GameState {
  players: { [playerId: string]: Player };
  teams: { [teamId: string]: Team };
  buzzer: {
    type: string;
    buzzes: { [playerId: string]: Buzz };
  };
}
