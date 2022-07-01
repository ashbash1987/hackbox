import { Socket } from "socket.io";
import Room from "./Room";
import Player from "./Player";
import Host from "./Host";

class RoomManager {
  rooms: { [roomCode: string]: Room };

  constructor() {
    this.rooms = {};
  }

  findRoom(roomCode: string) {
    return this.rooms[roomCode];
  }

  findOrCreateRoom(roomCode: string, host: Host) {
    const existingRoom = this.findRoom(roomCode);
    if (existingRoom) return existingRoom;

    const newRoom = new Room(roomCode, host)
    this.rooms[roomCode] = newRoom;
    return newRoom;
  }

  assignRoom(socket: Socket) {
    const { roomCode, userType } = socket.data;

    if (userType === 'host') {
      const host = new Host(socket);
      const room = this.findOrCreateRoom(roomCode, host)
      room.connectHost(host);
      return;
    }

    if (userType === 'player') {
      const player = new Player(socket);
      let room = this.findRoom(roomCode);
      if (!room) {
        socket.emit('error', { message: 'This room does not exist.' });
        socket.disconnect(true);
        return;
      }
      room.connectPlayer(player);
      return;
    }

    socket.emit('error', { message: "Please specify a valid userType. ('host', 'player', or 'viewer')" });
  }
}

export default new RoomManager();
