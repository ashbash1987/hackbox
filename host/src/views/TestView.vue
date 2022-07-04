<script setup lang="ts">
import { reactive } from "vue";
import router from "@/router";
import initializeHostSocket from "@/lib/sockets/hostSocket";

const { socket, state } = initializeHostSocket(router);

const playerStateInput = reactive({
  input: `{
    "theme": {
      "header": {
        "textColor": "black",
        "backgroundColor": "pink"
      },
      "main": {
        "backgroundColor": "#222233"
      }
    },
    "ui": {
      "header": {
        "text": "PLAYER"
      },
      "main": {
        "align": "center",
        "components": [
          {
            "type": "BuzzerButton",
            "props": {
              "label": "DEAL",
              "backgroundColor": "yellow",
              "textColor": "black"
            }
          },
          {
            "type": "BuzzerButton",
            "props": {
              "label": "NO DEAL",
              "backgroundColor": "red",
              "textColor": "white"
            }
          }
        ]
      }
    }
  }`
});

const updatePlayerState = (userId: string) => {
  const json = JSON.parse(playerStateInput.input);
  socket?.emit("update player", {
    to: userId,
    data: json,
  });
};
</script>

<template>
  <div class="about">
    <h1>Hosting {{ router.currentRoute.value.params.roomCode }}</h1>
    <textarea v-model="playerStateInput.input"></textarea>
    <h3>Players</h3>
    <p v-if="!Object.keys(state.players).length">None</p>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>User ID</th>
        <th>Send Message</th>
      </tr>
      <tr v-for="key in Object.keys(state.players)" :key="key">
        <td>{{ state.players[key].name }}</td>
        <td>{{ state.players[key].id }}</td>
        <td>
          <button @click="() => updatePlayerState(key)">Update</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<style>
textarea {
  height: 500px;
  width: 50%;
  margin: 10px;
}
</style>
