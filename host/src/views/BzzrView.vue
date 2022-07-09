<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";
import type { GameState } from "./bzzr/types";
import { textLayout, buzzerLayout } from "./bzzr/layouts";
import { getGameState, setGameState } from "@/lib/browserStorage";
import type { Message } from "@/types";

const roomCode = router.currentRoute.value.params.roomCode as string;

const { socket, state } = initializeHostSocket(router);
const defaultGameState = {
  players: {},
  buzzer: {
    active: false,
    buzzes: [],
  },
};

const gameState: GameState = reactive(
  getGameState(roomCode) || defaultGameState
);

socket.on("msg", (message: Message) => {
  if (
    message.event === "buzz" &&
    !gameState.buzzer.buzzes.find((buzz) => buzz.playerId === message.from)
  ) {
    gameState.buzzer.buzzes.push({
      playerId: message.from,
      localSpeed: message.message.ms as number,
      timestamp: message.timestamp,
    });
  }
  setGameState(roomCode, gameState);
});

const addMemberToGame = (userId: string) => {
  gameState.players[userId] = {
    id: userId,
    name: state.members[userId].name,
    locked: false,
    score: 0,
  };
  setGameState(roomCode, gameState);

  socket.emit("member.update", {
    to: userId,
    data: buzzerLayout(gameState),
  });
};

const removePlayerFromGame = (userId: string) => {
  delete gameState.players[userId];
  setGameState(roomCode, gameState);
  socket.emit("member.update", {
    to: userId,
    data: textLayout("Kicked from game."),
  });
};

const unlockPlayers = async (userIds: string[]) => {
  userIds.forEach((playerId) => {
    gameState.players[playerId].locked = false;
  });
  setGameState(roomCode, gameState);
  socket.emit("member.update", {
    to: userIds,
    data: buzzerLayout(gameState),
  });
};

const lockPlayers = async (userIds: string[]) => {
  userIds.forEach((playerId) => {
    gameState.players[playerId].locked = true;
  });
  setGameState(roomCode, gameState);
  socket.emit("member.update", {
    to: userIds,
    data: textLayout("You are locked out."),
  });
};

const toggleLock = async (userId: string) => {
  gameState.players[userId].locked
    ? unlockPlayers([userId])
    : lockPlayers([userId]);
};

const activateBuzzer = () => {
  gameState.buzzer.active = true;
  gameState.buzzer.buzzes = [];
  setGameState(roomCode, gameState);

  const to = Object.keys(gameState.players).filter(
    (key: string) => !gameState.players[key].locked
  );
  socket.emit("member.update", { to, data: buzzerLayout(gameState) });
};

const deactivateBuzzer = () => {
  gameState.buzzer.active = false;
  gameState.buzzer.buzzes = [];
  setGameState(roomCode, gameState);

  const to = Object.keys(gameState.players).filter(
    (key: string) => !gameState.players[key].locked
  );
  socket.emit("member.update", { to, data: buzzerLayout(gameState) });
};

const toggleBuzzer = () => {
  gameState.buzzer.active ? deactivateBuzzer() : activateBuzzer();
};

const increasePlayerScore = (userId: string) => {
  gameState.players[userId].score += 1;
  setGameState(roomCode, gameState);
};

const decreasePlayerScore = (userId: string) => {
  gameState.players[userId].score -= 1;
  setGameState(roomCode, gameState);
};

const timeDifferenceDisplay = (key: number): string => {
  if (key === 0) return "";
  const current = gameState.buzzer.buzzes[key].timestamp;
  const previous = gameState.buzzer.buzzes[key - 1].timestamp;
  const ms = current - previous;

  return `+${(ms / 1000).toFixed(3)}s`;
};
</script>

<template>
  <div class="about">
    <h1>{{ roomCode }}</h1>
    <h2>
      Buzzer is {{ gameState.buzzer.active ? "ACTIVATED" : "DEACTIVATED" }}
    </h2>
    <button @click="toggleBuzzer">
      {{ gameState.buzzer.active ? "Deactivate buzzer" : "Activate buzzer" }}
    </button>
    <h3>All Buzzes</h3>
    <p v-if="!gameState.buzzer.buzzes.length">None</p>
    <ol v-else>
      <li v-for="(buzz, key) in gameState.buzzer.buzzes" :key="key">
        <strong>{{ gameState.players[buzz.playerId].name }}</strong>
        {{ timeDifferenceDisplay(key) }}
      </li>
    </ol>
    <h3>Players</h3>
    <p v-if="!Object.keys(gameState.players).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>Score</th>
        <th>Actions</th>
      </tr>
      <tr v-for="key in Object.keys(gameState.players)" :key="key">
        <td>{{ gameState.players[key].name }}</td>
        <td>
          <button @click="() => decreasePlayerScore(key)">-</button>
          {{ gameState.players[key].score }}
          <button @click="() => increasePlayerScore(key)">+</button>
        </td>
        <td>
          <button @click="() => toggleLock(key)">
            {{ gameState.players[key].locked ? "Unlock" : "Lock" }}
          </button>
          <button @click="() => removePlayerFromGame(key)">Kick</button>
        </td>
      </tr>
    </table>

    <h3>Waiting in lobby...</h3>
    <p v-if="!Object.keys(state.members).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>Toggle</th>
      </tr>
      <tr
        v-for="key in Object.keys(state.members).filter(
          (key) => !gameState.players[key]
        )"
        :key="key"
      >
        <td>{{ state.members[key].name }}</td>
        <td>
          <button
            :disabled="!!gameState.players[key]"
            @click="() => addMemberToGame(key)"
          >
            Add to game
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
