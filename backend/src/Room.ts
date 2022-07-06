import { Socket } from "socket.io";
import Host from "./Host";
import Player, { SanitizedPlayer } from "./Player";
import type { PlayerState } from "../types";
import roomManager from "./RoomManager";

type SanitizedPlayers = { [id: string]: SanitizedPlayer };

class Room {
  id: string;
  host: Host;
  state: object;
  players: { [id: string]: Player };

  constructor(roomCode: string, host: Host, state: Partial<PlayerState> = {}) {
    this.id = roomCode;
    this.host = host;
    this.state = {};
    this.players = {};
  }

  join(userId: string, userName: string, socket: Socket) {
    socket.join(this.id);

    if (userId === this.host.id) {
      this.host.connect(socket);
    } else {
      let player = this.players[userId];
      if (!!player) {
        player.connect(socket);
      } else {
        player = new Player(userId, userName, this.id);
        this.players[userId] = player;
        player.connect(socket);
      }
    }

    this.sendPlayersToHost();
  }

  updateState(state: object) {
    this.state = state;
    roomManager.io?.to(this.id).emit("update state", this.state);
  }

  sendPlayersToHost() {
    const sanitizedPlayers = Object.values(this.players).reduce(
      (acc: SanitizedPlayers, player) => {
        acc[player.id] = player.sanitized;
        return acc;
      },
      {}
    );
    this.host.send("players", { players: sanitizedPlayers });
  }
}

export default Room;
