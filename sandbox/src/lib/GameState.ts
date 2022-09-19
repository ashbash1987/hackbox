import type { Member, Message } from "@/types";

const APP_PREFIX = "hackbox-sandbox";
const GAME_STATE_KEY = `${APP_PREFIX}-gameState`;

const defaults = {
  messages: [],
  members: {},
};

class GameState {
  roomCode: string;
  members: { [id: string]: Member };
  messages: Message[];

  constructor(roomCode: string) {
    this.roomCode = roomCode;

    const data = this.get() || defaults;
    this.members = data.members;
    this.messages = data.messages;

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
