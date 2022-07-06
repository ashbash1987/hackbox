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

const roomState: GameState = reactive({
  players: {},
  buzzer: {
    active: false,
  },
});
</script>

<template>
  <div class="about">
    <h1>{{ router.currentRoute.value.params.roomCode }}</h1>
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
          {{
            state.messages
              .reverse()
              .find((message) => message.from === state.players[key].id)
              ?.message.value
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
