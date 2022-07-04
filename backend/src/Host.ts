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

    socket.on("theme", async (payload) => {
      const recipients = [payload.to].flat();
      return Promise.allSettled(recipients.map((userId: string) => {
        const player = this.room.players[userId];
        player.updateTheme(payload);
      }));
    });

    socket.on("display", async (payload) => {
      const recipients = [payload.to].flat();
      return Promise.allSettled(recipients.map((userId: string) => {
        const player = this.room.players[userId];
        player.updateDisplay(payload);
      }));
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
