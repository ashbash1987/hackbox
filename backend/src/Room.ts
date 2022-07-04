import { Socket } from "socket.io";
import Host from "./Host";
import Player, { SanitizedPlayer } from "./Player";
import type { PlayerState } from "../types";

type SanitizedPlayers = { [id: string]: SanitizedPlayer }

class Room {
  id: string;
  host: Host;
  players: { [id: string]: Player };
  defaultPlayerState: PlayerState;

  constructor(roomCode: string, host: Host) {
    this.id = roomCode;
    this.host = host;
    this.players = {};
    this.defaultPlayerState = {
      theme: {
        header: {
          textColor: "white",
          backgroundColor: "#333333",
        },
        main: {
          backgroundColor: "#888888",
        },
      },
      ui: {
        header: {
          text: this.id,
        },
        main: {
          align: "start",
          components: [],
        },
      }
    };
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
        player = new Player(userId, userName, this.id, this.defaultPlayerState);
        this.players[userId] = player;
        player.connect(socket);
      }
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
