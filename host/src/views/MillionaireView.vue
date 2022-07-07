<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

interface GameState {
  members: {
    [id: string]: {
      dollarScore: number;
      numberCorrect: number;
    };
  };
}

const { socket, state } = initializeHostSocket(router);

const roomState: GameState = reactive({
  members: {},
  buzzer: {
    active: false,
  },
});
</script>

<template>
  <div class="about">
    <h1>{{ router.currentRoute.value.params.roomCode }}</h1>
    <h3>Members</h3>
    <p v-if="!Object.keys(state.members).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>User ID</th>
        <th>Toggle</th>
      </tr>
      <tr v-for="key in Object.keys(state.members)" :key="key">
        <td>{{ state.members[key].name }}</td>
        <td>{{ state.members[key].id }}</td>
        <td>
          {{
            state.messages
              .reverse()
              .find((message) => message.from === state.members[key].id)
              ?.message.value
          }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
