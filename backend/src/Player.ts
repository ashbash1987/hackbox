import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

export interface SanitizedPlayer {
  id: string;
  name: string;
}

export interface ThemeState {
  backgroundColor?: string;
}

export interface DisplayState {
  components?: unknown[];
}

class Player {
  socket: Socket | null;
  id: string;
  name: string;
  roomCode: string;
  display: DisplayState;
  theme: ThemeState;

  constructor(id: string, name: string, roomCode: string) {
    this.id = id;
    this.name = name;
    this.roomCode = roomCode;
    this.socket = null;
    this.display = {};
    this.theme = {};
  }

  connect(socket: Socket) {
    this.socket = socket;

    this.socket.on("msg", (payload) => {
      this.room.host.send("msg", ({ ...payload, userId: this.id }))
    });
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }

  get sanitized(): SanitizedPlayer {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export default Player;
