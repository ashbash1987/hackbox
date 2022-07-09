export interface Buzz {
  playerId: string;
  timestamp: number;
  localSpeed: number;
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

export interface GameState {
  players: {
    [id: string]: Player;
  };
  teams: { [key: string]: Team };
  buzzer: {
    buzzes: Buzz[];
  };
}
