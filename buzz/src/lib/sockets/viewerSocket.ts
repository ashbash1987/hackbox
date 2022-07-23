import { io } from "socket.io-client";
import { reactive } from "vue";
import type { Router } from "vue-router";
import config from "@/config";
import { v4 as uuidV4 } from "uuid";
import type { GameState } from "@/views/helpers/types";

const initializeViewerSocket = (router: Router) => {
  const socket = io(config.backendUri, {
    query: {
      userId: uuidV4(),
      roomCode: router.currentRoute.value.params.roomCode,
      userName: "Viewer",
    },
  });

  const state: GameState = reactive({
    players: {},
    teams: {},
    buzzer: {
      type: "",
      buzzes: {},
    },
  });

  socket.on("state.room", (payload) => {
    state.players = payload.players;
    state.teams = payload.teams;
    state.buzzer = payload.buzzer;
  });

  return { socket, state };
};

export default initializeViewerSocket;
