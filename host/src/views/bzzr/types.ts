export interface Buzz {
  playerId: string;
  timestamp: number;
  localSpeed: number;
}

export interface GameState {
  players: {
    [id: string]: {
      id: string;
      name: string;
      locked: boolean;
      score: number;
    };
  };
  buzzer: {
    active: boolean;
    buzzes: Buzz[];
  };
}
