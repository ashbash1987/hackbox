import { io, Socket } from "socket.io-client";
import type { Router } from "vue-router";
import { getUserId, getUserName, getRoomCode } from "@/lib/browserStorage";
import type { HostState } from "@/types";

const attachHostEvents = (socket: Socket, state: HostState, router: Router) => {
  socket.on("msg", (payload) => {
    console.log('received message', payload);
  });

  socket.on("players", (payload) => {
    state.players = payload.players;
  });

  socket.on("disconnect", (reason: string) => {
    const reconnectReasons = ['ping timeout', 'transport close', 'transport error'];
    if (reconnectReasons.includes(reason)) return;
    router.push('/')
  });

  socket.on("error", (payload: { message: string }) => {
    alert(payload.message);
  })
}

const initializeHostSocket = (router: Router, state: HostState) => {
  const socket = io(`http://localhost:9001`, {
    query: {
      userType: 'host',
      userId: getUserId(),
      roomCode: getRoomCode(),
    }
  });

  attachHostEvents(socket, state, router);

  return socket;
};

export default initializeHostSocket;
