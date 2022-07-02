import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

class Host {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.socket.on("theme", (payload) => {
      const player = this.room.players[payload.to];
      player.theme = payload;
      player.socket.emit("theme", player.theme);
    });

    this.socket.on("display", (payload) => {
      const player = this.room.players[payload.to];
      player.display = payload;
      player.socket.emit("display", player.display);
    });
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }

  get roomCode() {
    return this.socket.data.roomCode;
  }

  get userId() {
    return this.socket.data.userId;
  }
}

export default Host;
