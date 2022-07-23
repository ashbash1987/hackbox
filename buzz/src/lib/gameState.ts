import type { Player, Team, Buzz } from "../views/helpers/types";
import type { Message } from "@/types";

const APP_PREFIX = "hackbox-host";
const GAME_STATE_KEY = `${APP_PREFIX}-gameState`;

const defaults = {
  players: {},
  teams: {},
  buzzer: { type: "Buzzer", buzzes: {} },
  messages: [],
  members: {},
};

class GameState {
  roomCode: string;
  members: { [id: string]: Player };
  players: { [id: string]: Player };
  teams: { [id: string]: Team };
  messages: Message[];
  buzzer: {
    type: string;
    buzzes: { [playerId: string]: Buzz };
  };

  constructor(roomCode: string) {
    this.roomCode = roomCode;

    const data = this.get() || defaults;
    this.members = data.members;
    this.players = data.players;
    this.teams = data.teams;
    this.messages = data.messages;
    this.buzzer = data.buzzer;

    this.save();
  }

  get storageKey() {
    return `${GAME_STATE_KEY}-${this.roomCode}`;
  }

  get() {
    const stateString = window.localStorage.getItem(this.storageKey);
    return stateString ? JSON.parse(stateString) : null;
  }

  save() {
    const stateString = JSON.stringify(this);
    window.localStorage.setItem(this.storageKey, stateString);
  }
}

export default GameState;
