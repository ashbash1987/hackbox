import 'dotenv/config';

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import roomManager from "./RoomManager";

const port: number = parseInt(process.env.PORT as string, 10) || 3000;

const app = express();

const options: cors.CorsOptions = {
  origin: "http://localhost:3000",
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
