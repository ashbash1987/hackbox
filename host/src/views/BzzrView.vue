<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

interface GameState {
  members: {
    [id: string]: {
      locked: boolean;
      score: number;
    };
  };
  buzzer: {
    active: boolean;
  };
}

const { socket, state } = initializeHostSocket(router);
const gameState: GameState = reactive({
  members: {},
  buzzer: {
    active: false,
  },
});

const toggleMember = (userId: string) => {
  gameState.members[userId] = {
    locked: false,
    score: 0,
  };
};

const enableBuzzers = () => {
  socket.emit("update player", {
    to: Object.keys(gameState.members).filter(
      (key: string) => !gameState.members[key].locked
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
          <button @click="() => toggleMember(key)">
            {{ gameState.members[key] ? "Active" : "Inactive" }}
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
