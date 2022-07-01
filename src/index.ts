import { Server, Socket } from "socket.io";
import dotenv from 'dotenv';
import roomManager from "./RoomManager";

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;

const io = new Server({
  cors: {
    origin: "*",
    credentials: false,
  }
});

io.on("connection", (socket: Socket) => {
  const { userType, userId, userName, roomCode } = socket.handshake.query;

  socket.data.userType = userType;
  socket.data.userId = userId;
  socket.data.userName = userName;
  socket.data.roomCode = roomCode;

  roomManager.assignRoom(socket);
});

io.listen(port);
