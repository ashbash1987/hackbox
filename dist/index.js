"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const RoomManager_1 = __importDefault(require("./RoomManager"));
dotenv_1.default.config();
const port = parseInt(process.env.PORT, 10) || 3000;
const io = new socket_io_1.Server({
    cors: {
        origin: "*",
        credentials: false,
    }
});
io.on("connection", (socket) => {
    const { userType, userId, userName, roomCode } = socket.handshake.query;
    socket.data.userType = userType;
    socket.data.userId = userId;
    socket.data.userName = userName;
    socket.data.roomCode = roomCode;
    RoomManager_1.default.assignRoom(socket);
});
io.listen(port);
