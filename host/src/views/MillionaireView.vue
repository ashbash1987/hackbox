<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

interface GameState {
  players: {
    [id: string]: {
      dollarScore: number;
      numberCorrect: number;
    };
  };
}


const { socket, state } = initializeHostSocket(router);
const gameState: GameState = reactive({
  players: {},
  buzzer: {
    active: false,
  },
});

const togglePlayer = (userId: string) => {
  gameState.players[userId] = {
    locked: false,
    score: 0,
  };
};

const enableBuzzers = () => {
  socket.emit("update player", {
    to: Object.keys(gameState.players).filter(
      (key: string) => !gameState.players[key].locked
    ),
    data: {
      ui: {
        main: {
          align: "end",
          components: [
            {
              type: "BuzzerButton",
              props: {
                label: "BUZZ!",
                backgroundColor: "red",
                textColor: "white",
              },
            },
          ],
        },
      },
    },
  });
};
</script>

<template>
  <div class="about">
    <h1>{{ router.currentRoute.value.params.roomCode }}</h1>
    <button @click="enableBuzzers">Enable Buzzers</button>
    <h3>Players</h3>
    <p v-if="!Object.keys(state.players).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>User ID</th>
        <th>Toggle</th>
      </tr>
      <tr v-for="key in Object.keys(state.players)" :key="key">
        <td>{{ state.players[key].name }}</td>
        <td>{{ state.players[key].id }}</td>
        <td>
          <button @click="() => togglePlayer(key)">
            {{ gameState.players[key] ? "Active" : "Inactive" }}
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
