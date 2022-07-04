<script setup lang="ts">
import { reactive } from "vue";
import initializePlayerSocket from "@/lib/sockets/playerSocket";
import router from "@/router";
import type { PlayerState } from "@/types";
import { getRoomCode, getUserName } from "@/lib/browserStorage";
const defaultTheme = {
  navbarColor: "lightblue",
  backgroundColor: "#424952",
};

const defaultDisplay = {
  components: [],
};

const roomCode = getRoomCode();
const userName = getUserName();

const state: PlayerState = reactive({
  theme: defaultTheme,
  display: defaultDisplay,
});

initializePlayerSocket(router, state);
</script>

<template>
  <div class="player-wrapper">
    <div class="player-nav--wrapper">
      <div class="player-nav">{{ userName }} in {{ roomCode }}</div>
    </div>
    <div class="player-main--wrapper">
      <div class="player-main">
        <component
          v-for="(comp, key) in state.display.components"
          :is="comp.type"
          :key="key"
          :custom="comp.props"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.player-nav--wrapper {
  display: flex;
  justify-content: center;
  height: 50px;
  z-index: 10;
  color: black;
  background-color: v-bind("state.theme.navbarColor");
}

.player-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 350px;
  max-width: 450px;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
}

.player-main--wrapper {
  display: flex;
  justify-content: center;
  margin-top: -50px;
  min-height: 100vh;
  background-color: v-bind("state.theme.backgroundColor");
}

.player-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-width: 350px;
  max-width: 450px;
  padding: 20px;
}

.input-area {
  display: flex;
  flex-direction: column;
  margin-block: 10px;
  margin-inline: 20px;
}

label {
  font-size: 18px;
  margin-left: 8px;
  margin-bottom: 6px;
  font-weight: 800;
  color: #444444;
}

input {
  border: 0;
  font-size: 18px;
  background-color: #dddddd;
  padding: 10px;
  border-radius: 5px;
  font-weight: 800;
  text-transform: uppercase;
}

button {
  border: 0;
  border-radius: 5px;
  margin-top: 20px;
  font-size: 20px;
  font-weight: 800;
  margin-inline: 40px;
  padding: 20px;
  color: white;
  background-color: #4254f4;
  opacity: 0.9;
  transition: color 0.2s, background-color 0.2s, opacity 0.2s;
}

button:disabled {
  color: #777777;
  background-color: #eeeeee;
}

button:hover {
  cursor: pointer;
}

button:hover:not(:disabled) {
  opacity: 1;
}

.host-link {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  color: #4254f4;
  font-size: 12px;
  text-decoration: none;
}
</style>
