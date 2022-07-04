<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";
import type { Component, HostState } from "@/types";

const state: HostState = reactive({
  players: {},
});

const socket = initializeHostSocket(router, state);

const customColor = "white";

const sendTheme = (userId: string, backgroundColor: string) => {
  socket?.emit("theme", {
    to: userId,
    theme: {
      backgroundColor,
    },
  });
};

const sendDisplay = (userId: string, components: Component[]) => {
  socket?.emit("display", {
    to: userId,
    display: { components },
  });
};
</script>

<template>
  <div class="about">
    <h1>Hosting</h1>
    <label>
      Custom Color
      <input v-model="customColor" />
    </label>
    <h3>Players</h3>
    <p v-if="!Object.keys(state.players).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>User ID</th>
        <th>Socket ID</th>
        <th>Send Message</th>
      </tr>
      <tr v-for="key in Object.keys(state.players)" :key="key">
        <td>{{ state.players[key].name }}</td>
        <td>{{ state.players[key].id }}</td>
        <td>{{ state.players[key].socketId }}</td>
        <td>
          <button
            @click="
              sendDisplay(state.players[key].id, [{ type: 'text', value: 'bing' }])
            "
          >
            Bing
          </button>
          <button
            @click="
              sendDisplay(state.players[key].id, [{ type: 'text', value: 'bong' }])
            "
          >
            Bong
          </button>
          <button @click="sendTheme(state.players[key].id, 'red')">Red</button>
          <button @click="sendTheme(state.players[key].id, 'blue')">Blue</button>
          <button @click="sendTheme(state.players[key].id, customColor)">Custom Color</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style></style>
