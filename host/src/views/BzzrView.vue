<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";
import type { GameState } from "./bzzr/types";
import { textLayout, buzzerLayout } from "./bzzr/layouts";

const { socket, state } = initializeHostSocket(router);
const gameState: GameState = reactive({
  players: {},
  buzzer: {
    active: false,
  },
});

const addMemberToGame = (userId: string) => {
  gameState.players[userId] = {
    id: userId,
    name: state.members[userId].name,
    locked: false,
    score: 0,
  };

  socket.emit("update player", { to: userId, data: buzzerLayout(gameState) });
};

const removePlayerFromGame = (userId: string) => {
  delete gameState.players[userId];
  socket.emit("update player", {
    to: userId,
    data: textLayout("Kicked from game."),
  });
};

const unlockPlayers = async (userIds: string[]) => {
  userIds.forEach((playerId) => {
    gameState.players[playerId].locked = false;
  });
  socket.emit("update player", { to: userIds, data: buzzerLayout(gameState) });
};

const lockPlayers = async (userIds: string[]) => {
  userIds.forEach((playerId) => {
    gameState.players[playerId].locked = true;
  });
  socket.emit("update player", {
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

  const to = Object.keys(gameState.players).filter(
    (key: string) => !gameState.players[key].locked
  );
  socket.emit("update player", { to, data: buzzerLayout(gameState) });
};

const deactivateBuzzer = () => {
  gameState.buzzer.active = false;
  state.messages = [];

  const to = Object.keys(gameState.players).filter(
    (key: string) => !gameState.players[key].locked
  );
  socket.emit("update player", { to, data: buzzerLayout(gameState) });
};

const toggleBuzzer = () => {
  gameState.buzzer.active ? deactivateBuzzer() : activateBuzzer();
};

const increasePlayerScore = (userId: string) => {
  gameState.players[userId].score += 1;
};

const decreasePlayerScore = (userId: string) => {
  gameState.players[userId].score -= 1;
};

const timeDifferenceDisplay = (key: number): string => {
  if (key === 0) return "";
  const current = state.messages[key].timestamp;
  const previous = state.messages[key - 1].timestamp;
  const ms = current - previous;

  return `+${(ms / 1000).toFixed(3)}s`;
};
</script>

<template>
  <div class="about">
    <h1>{{ router.currentRoute.value.params.roomCode }}</h1>
    <h2>
      Buzzer is {{ gameState.buzzer.active ? "ACTIVATED" : "DEACTIVATED" }}
    </h2>
    <button @click="toggleBuzzer">
      {{ gameState.buzzer.active ? "Deactivate buzzer" : "Activate buzzer" }}
    </button>
    <h3>All Buzzes</h3>
    <p v-if="!state.messages.length">None</p>
    <ol v-else>
      <li v-for="(message, key) in state.messages" :key="key">
        <strong>{{ gameState.players[message.from].name }}</strong>
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
