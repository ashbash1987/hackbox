import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

class Host {
  socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.initializeSocketEvents();
  }

  initializeSocketEvents() {
    this.socket.on("msg", (payload) => {
      const player = this.room.players[payload.to];
      player.lastReceivedMessage = payload;
      player.socket.emit("msg", player.lastReceivedMessage);
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
