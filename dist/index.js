"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const RoomManager_1 = __importDefault(require("./RoomManager"));
const port = parseInt(process.env.PORT, 10) || 3000;
const app = (0, express_1.default)();
const options = {
    origin: "http://localhost:3000",
};
app.use((0, cors_1.default)(options));
app.get('/rooms/:roomCode', (req, res) => {
    const roomCode = req.params.roomCode;
    const exists = !!RoomManager_1.default.findRoom(roomCode);
    res.json({ exists });
});
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
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
server.listen(port);
