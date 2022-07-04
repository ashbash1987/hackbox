import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

export interface SanitizedPlayer {
  id: string;
  name: string;
}

export interface ThemeState {
  navbarColor?: string;
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

    this.updateTheme({});
    this.updateDisplay({});
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  updateTheme(payload: object) {
    this.theme = { ...this.theme, ...payload };
    this.send("theme", this.theme);
  }

  updateDisplay(payload: object) {
    this.display = { ...this.display, ...payload };
    this.send("display", this.display);
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
