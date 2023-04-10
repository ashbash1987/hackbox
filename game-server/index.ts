import "dotenv/config";

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import roomManager, { HandshakeMetadata } from "./src/RoomManager";
import Room from "./src/Room";

const port: number = 9000;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/rooms/:roomCode", (req, res) => {
  const roomCode = req.params.roomCode as string;
  const exists = !!roomManager.findRoom(roomCode);
  res.json({ exists });
});

app.get("/rooms/:roomCode/auth-host/:userId", (req, res) => {
  const { roomCode, userId } = req.params;
  const room = roomManager.findRoom(roomCode);
  const authed = userId === room?.host.id;
  res.json({ authed });
});

app.post("/rooms", (req, res) => {
  let roomCode: string;
  let newRoom: Room;

  const specifiedRoomCode = req.body.roomCode as string;

  if (specifiedRoomCode) {
    if (specifiedRoomCode.length !== 4)
      return res.json({ error: "invalid room code" });
    if (roomManager.findRoom(specifiedRoomCode))
      return res.json({ error: "room code unavailable" });
    roomCode = specifiedRoomCode;
  } else {
    roomCode = roomManager.generateRoomCode();
  }

  newRoom = roomManager.createRoom(req.body.hostId, roomCode);

  return res.json({ ok: true, roomCode: newRoom.id });
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

roomManager.io = io;

interface Handshake {
  userId: string;
  userName: string;
  roomCode: string;
  metadata: string;
}

io.on("connection", async (socket: Socket) => {
  const handshake = socket.handshake.query as unknown as Handshake;
  const { userId, userName, roomCode } = handshake;
  let { metadata } = handshake;

  let handshakeMetadata = {} as HandshakeMetadata;

  try {
    handshakeMetadata = JSON.parse(metadata) as HandshakeMetadata;
  } catch (error) {
    console.error("Handshake metadata was not a JSON string.");
  }

  await roomManager.joinRoom(
    socket,
    userId,
    userName,
    roomCode,
    handshakeMetadata
  );
});

server.listen(port);

console.log(`✨ Backend listening on ${port}!`);
