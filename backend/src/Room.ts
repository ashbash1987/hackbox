import { Socket } from "socket.io";
import Host from "./Host";
import Member, { SanitizedMember } from "./Member";
import type { MemberState } from "../types";
import roomManager from "./RoomManager";

type SanitizedMembers = { [id: string]: SanitizedMember };

class Room {
  id: string;
  host: Host;
  state: object;
  members: { [id: string]: Member };

  constructor(roomCode: string, host: Host, state: Partial<MemberState> = {}) {
    this.id = roomCode;
    this.host = host;
    this.state = {};
    this.members = {};
  }

  join(userId: string, userName: string, socket: Socket) {
    socket.join(this.id);

    if (userId === this.host.id) {
      this.host.connect(socket);
    } else {
      let player = this.members[userId];
      if (!!player) {
        player.connect(socket);
      } else {
        player = new Member(userId, userName, this.id);
        this.members[userId] = player;
        player.connect(socket);
      }
    }

    this.sendMembersToHost();
  }

  updateState(state: object) {
    this.state = state;
    roomManager.io?.to(this.id).emit("update state", this.state);
  }

  sendMembersToHost() {
    const sanitizedMembers = Object.values(this.members).reduce(
      (acc: SanitizedMembers, player) => {
        acc[player.id] = player.sanitized;
        return acc;
      },
      {}
    );
    this.host.send("members", { members: sanitizedMembers });
  }
}

export default Room;
