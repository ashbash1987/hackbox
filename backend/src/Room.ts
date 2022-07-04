import { Socket } from "socket.io";
import Host from "./Host";
import Player, { SanitizedPlayer } from "./Player";

type SanitizedPlayers = { [id: string]: SanitizedPlayer }

class Room {
  id: string;
  host: Host;
  players: { [id: string]: Player };

  constructor(roomCode: string, host: Host) {
    this.id = roomCode;
    this.host = host;
    this.players = {};
  }

  join(userId: string, userName: string, socket: Socket) {
    if (userId === this.host.id) {
      this.host.connect(socket);
      return;
    }

    const existingPlayer = this.players[userId];
    if (!!existingPlayer) {
      existingPlayer.connect(socket);
    } else {
      const newPlayer = new Player(userId, userName, this.id);
      this.players[userId] = newPlayer;
      newPlayer.connect(socket);
    }

    this.sendPlayersToHost();
  }

  sendPlayersToHost() {
    const sanitizedPlayers = Object.values(this.players).reduce((acc: SanitizedPlayers, player) => {
      acc[player.id] = player.sanitized;
      return acc;
    }, {});
    this.host.send("players", { players: sanitizedPlayers });
  }
}

export default Room;
