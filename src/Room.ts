import Host from "./Host";
import Player, { SanitizedPlayer } from "./Player";

type SanitizedPlayers = { [userId: string]: SanitizedPlayer }

class Room {
  code: string;
  host: Host;
  players: { [userId: string]: Player };

  constructor(roomCode: string, host: Host) {
    this.code = roomCode;
    this.host = host;
    this.players = {};
  }

  connectHost(host: Host) {
    if (this.host.userId === host.userId) {
      this.host = host;
      host.socket.join(this.code);
      this.sendPlayersToHost();
      return;
    } else {
      host.socket.emit('error', { message: 'You are not the host of this room.' });
      host.socket.disconnect(true);
      return;
    }
  }

  connectPlayer(player: Player) {
    let existingPlayer = this.players[player.userId];
    if (existingPlayer) {
      existingPlayer.socket = player.socket;
    } else {
      this.players[player.userId] = player;
    }

    existingPlayer = this.players[player.userId];

    existingPlayer.socket.join(this.code);
    this.sendPlayersToHost();
    existingPlayer.socket.emit('msg', existingPlayer.lastReceivedMessage);
  }

  sendPlayersToHost() {
    const sanitizedPlayers = Object.values(this.players).reduce((acc: SanitizedPlayers, player) => {
      acc[player.userId] = player.sanitized;
      return acc;
    }, {});
    this.host.socket.emit("players", { players: sanitizedPlayers });
  }
}

export default Room;
