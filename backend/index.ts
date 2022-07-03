import 'dotenv/config';

import express from "express";
import cors, { CorsOptions } from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import roomManager from "./src/RoomManager";

const port: number = parseInt(process.env.PORT, 10);

const app = express();

const options: CorsOptions = {
  origin: [process.env.PLAYER_ORIGIN],
};

app.use(cors(options));

app.get('/rooms/:roomCode', (req, res) => {
  const roomCode = req.params.roomCode as string;
  const exists = !!roomManager.findRoom(roomCode);
  res.json({ exists });
})

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
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

server.listen(port);

console.log(`✨ Backend listening on ${port}!`);
