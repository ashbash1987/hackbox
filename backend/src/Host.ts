import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

class Host {
  id: string;
  roomCode: string;
  socket: Socket | undefined;

  constructor(id: string, roomCode: string) {
    this.id = id;
    this.roomCode = roomCode;
  }

  connect(socket: Socket) {
    this.socket = socket;

    socket.on("theme", (payload) => {
      const player = this.room.players[payload.to];
      player.theme = payload;
      player.send("theme", player.theme);
    });

    socket.on("display", (payload) => {
      const player = this.room.players[payload.to];
      player.display = payload;
      player.send("display", player.display);
    });
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }
}

export default Host;
