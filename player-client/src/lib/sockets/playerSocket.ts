import config from "@/config";
import { io, Socket } from "socket.io-client";
import { reactive } from "vue";
import type { Router } from "vue-router";
import type { PlayerState, PlayerStatePayload } from "@/types";
import {
  getUserId,
  getUserName,
  getRoomCode,
  getTwitchAccessToken,
} from "@/lib/browserStorage";
import { expandStatePresets } from "../stateHelpers";

const getVersion = (payload: PlayerStatePayload) =>
  payload.version ? payload.version : 1;

const attachPlayerEvents = (
  socket: Socket,
  state: PlayerState,
  router: Router
) => {
  socket.on("disconnect", (reason: string) => {
    const reconnectReasons = [
      "ping timeout",
      "transport close",
      "transport error",
    ];
    if (reconnectReasons.includes(reason)) return;
    router.push("/");
  });

  socket.on("error", (payload: { message: string }) => {
    alert(payload.message);
  });

  socket.on("state.member", (payload: PlayerStatePayload) => {
    const newState = expandStatePresets(payload);

    state.version = getVersion(payload);
    state.theme = newState.theme;
    state.ui = newState.ui;
  });
};

const initializePlayerSocket = (router: Router, defaultState: PlayerState) => {
  const socket = io(config.backendUri, {
    query: {
      userId: getUserId(),
      userName: getUserName(),
      roomCode: getRoomCode(),
      metadata: JSON.stringify({
        twitchAccessToken: getTwitchAccessToken(),
      }),
    },
  });

  const state = reactive(defaultState);

  attachPlayerEvents(socket, state, router);

  return { socket, state };
};

export default initializePlayerSocket;
