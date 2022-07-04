import { Socket } from "socket.io";
import Room from "./Room";
import Host from "./Host";

class RoomManager {
  rooms: { [roomCode: string]: Room };

  constructor() {
    this.rooms = {};
  }

  generateRoomCode = () => {
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Z'];
    return [1, 2, 3, 4].map(() => consonants[Math.floor(Math.random() * consonants.length)]).join('');
  }

  findRoom(roomCode: string) {
    return this.rooms[roomCode];
  }

  createRoom(hostId: string, roomCode: string): Room {
    const existingRoom = this.findRoom(roomCode);
    if (existingRoom) return this.createRoom(hostId, this.generateRoomCode());

    const newRoom = new Room(roomCode, new Host(hostId, roomCode));
    this.rooms[roomCode] = newRoom;
    return newRoom;
  }

  joinRoom(socket: Socket, userId: string, userName: string, roomCode: string) {
    let room = this.findRoom(roomCode);
    if (!room) {
      socket.emit('error', { message: 'This room does not exist.' });
      socket.disconnect(true);
      return;
    }

    room.join(userId, userName, socket);
  }
}

export default new RoomManager();
