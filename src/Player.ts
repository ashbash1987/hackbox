import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

export interface SanitizedPlayer {
  id: string;
  socketId: string;
  name: string;
}

export interface ThemeState {
  backgroundColor?: string;
}

export interface DisplayState {
  components?: unknown[];
}

class Player {
  socket: Socket;
  display: DisplayState;
  theme: ThemeState;

  constructor(socket: Socket) {
    this.socket = socket;
    this.display = {};
    this.theme = {};
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.socket.on("msg", (payload) => {
      this.room.host.socket.emit("msg", ({ ...payload, userId: this.userId }))
    });
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }

  get userId() {
    return this.socket.data.userId;
  }

  get roomCode() {
    return this.socket.data.roomCode;
  }

  get name() {
    return this.socket.data.userName;
  }

  get sanitized(): SanitizedPlayer {
    return {
      id: this.userId,
      socketId: this.socket.id,
      name: this.name,
    };
  }
}

export default Player;
