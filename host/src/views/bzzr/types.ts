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
  };
}
