import type { Socket } from "socket.io";
import roomManager from "./RoomManager";

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
        const player = this.room.members[recipientId];
        player?.updateState(payload.data);
      });
    });

    socket.on("room.update", async (payload) => {
      this.room.updateGameState(payload);
    });

    socket.on("event", async (payload) => {
      this.room.sendEventToRoom(payload);
    });
  }

  send(eventName: string, payload: unknown) {
    this.socket?.emit(eventName, payload);
  }

  sendState() {
    this.send("state.host", this.privateState);
  }

  get privateState() {
    const room = this.room;

    return {
      roomCode: this.id,
      members: Object.entries(room.members).reduce((acc, [userId, member]) => {
        acc[userId] = {
          id: userId,
          name: member.name,
          messages: member.messages,
        };
        return acc;
      }, {} as { [key: string]: object }),
    };
  }

  get room() {
    return roomManager.findRoom(this.roomCode);
  }
}

export default Host;
