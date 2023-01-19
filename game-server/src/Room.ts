import { Socket } from "socket.io";
import Host from "./Host";
import Member from "./Member";
import roomManager from "./RoomManager";

class Room {
  id: string;
  host: Host;
  members: { [id: string]: Member };

  constructor(roomCode: string, host: Host) {
    this.id = roomCode;
    this.host = host;
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
    this.sendPrivateStateToHost();
  }

  sendPrivateStateToHost() {
    this.host.send("state.host", this.privateState);
  }

  sendEventToRoom(payload: object) {
    roomManager.io?.to(this.id).emit("event", payload);
  }

  get privateState() {
    return {
      members: Object.values(this.members).reduce(
        (acc: { [memberId: string]: object }, member) => {
          acc[member.id] = {
            id: member.id,
            name: member.name,
          };
          return acc;
        },
        {}
      ),
    };
  }
}

export default Room;