import type { Socket } from "socket.io";
import roomManager from "./RoomManager";
import Room from "./Room";

const forAllRecipients = (
  recipients: any,
  callback: (recipientId: string) => void
) => {
  return Promise.allSettled([recipients].flat().map(callback));
};

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

    socket.on("member.update", async (payload) => {
      await forAllRecipients(payload.to, (recipientId) => {
        const player = this.room.members.get(recipientId);
        player?.updateState(payload.data);
      });
    });

    socket.on("event", async (payload) => {
      this.room.sendEventToRoom(payload);
    });
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  get room() {
    return roomManager.findRoom(this.roomCode) as Room;
  }
}

export default Host;
