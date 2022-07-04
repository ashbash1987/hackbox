import type { Socket } from "socket.io";
import roomManager from "./RoomManager";
import type { PlayerState } from "../types";
export interface SanitizedPlayer {
  id: string;
  name: string;
  state: PlayerState;
}

class Player {
  socket: Socket | null;
  id: string;
  name: string;
  roomCode: string;
  state: PlayerState;

  constructor(id: string, name: string, roomCode: string, state: PlayerState) {
    this.id = id;
    this.name = name;
    this.roomCode = roomCode;
    this.state = state;
    this.socket = null;
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on("msg", (payload) => {
      this.room.host.send("msg", ({ ...payload, userId: this.id }))
    });

    this.updateState();
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  updateState(newState: Partial<PlayerState> = {}) {
    if (newState.theme) {
      if (newState.theme.header) this.state.theme.header = { ...this.state.theme.header, ...newState.theme.header };
      if (newState.theme.main) this.state.theme.main = { ...this.state.theme.main, ...newState.theme.main }
    }

    if (newState.ui) {
      if (newState.ui.header) this.state.ui.header = newState.ui.header;
      if (newState.ui.main) this.state.ui.main = newState.ui.main;
    }

    this.send("update", this.state);
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }

  get sanitized(): SanitizedPlayer {
    return {
      id: this.id,
      name: this.name,
      state: this.state,
    };
  }
}

export default Player;
