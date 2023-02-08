import { Server, Socket } from "socket.io";
import axios from "axios";
import Room from "./Room";
import Host from "./Host";

class RoomManager {
  io: Server | null;
  rooms: { [roomCode: string]: Room };

  constructor() {
    this.io = null;
    this.rooms = {};
  }

  generateRoomCode = () => {
    const consonants = [
      "B",
      "C",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "M",
      "N",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "V",
      "W",
      "X",
      "Z",
    ];
    return [1, 2, 3, 4]
      .map(() => consonants[Math.floor(Math.random() * consonants.length)])
      .join("");
  };

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

  async joinRoom(
    socket: Socket,
    userId: string,
    userName: string,
    roomCode: string,
    twitchAccessToken: string | undefined
  ) {
    let room = this.findRoom(roomCode);
    if (!room) {
      socket.emit("error", { message: "This room does not exist." });
      socket.disconnect(true);
      return;
    }

    let twitchData;

    if (twitchAccessToken) {
      const response = await axios({
        method: "GET",
        url: "https://api.twitch.tv/helix/users",
        headers: {
          Authorization: "Bearer " + twitchAccessToken,
          "Client-Id": "qlfz8nlzzkq20jhl1xuawhza5xa3fm",
        },
      });

      if (response.status === 200) {
        const userData = response.data.data[0];

        twitchData = {
          id: userData.id,
          username: userData.display_name,
          photo: userData.profile_image_url,
        };
      }
    }

    room.join(userId, userName, socket, twitchData);
  }
}

export default new RoomManager();
