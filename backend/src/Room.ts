import { Socket } from "socket.io";
import Host from "./Host";
import Member from "./Member";
import roomManager from "./RoomManager";

class Room {
  id: string;
  host: Host;
  gameState: object;
  members: { [id: string]: Member };

  constructor(roomCode: string, host: Host) {
    this.id = roomCode;
    this.host = host;
    this.gameState = {};
    this.members = {};
  }

  join(userId: string, userName: string, socket: Socket) {
    socket.join(this.id);

    let user: Host | Member;

    if (userId === this.host.id) {
      user = this.host;
    } else {
      user = this.members[userId];
      if (!user) {
        user = new Member(userId, userName, this.id);
        this.members[userId] = user;
      }
    }

    user.connect(socket);
    this.host.sendState();
    this.sendGameStateToUser(user);
  }

  updateGameState(payload: object) {
    this.gameState = payload;
    this.sendGameStateToRoom();
  }

  sendGameStateToUser(user: Member | Host) {
    user.send("state.room", this.gameState);
  }

  sendGameStateToRoom() {
    roomManager.io?.to(this.id).emit("state.room", this.gameState);
  }

  sendEventToRoom(payload: object) {
    roomManager.io?.to(this.id).emit("event", payload);
  }
}

export default Room;
