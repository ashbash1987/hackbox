<script setup lang="ts">
import { provide } from "vue";
import initializePlayerSocket from "@/lib/sockets/playerSocket";
import router from "@/router";
import type { PlayerState } from "@/types";

const defaultState: PlayerState = {
  theme: {
    header: {
      textColor: "black",
      backgroundColor: "black",
    },
    main: {
      backgroundColor: "black",
    },
  },
  ui: {
    header: {
      text: "",
    },
    main: {
      align: "start",
      components: [],
    },
  },
};

const getComponentType = (type: string) => {
  const newTypes = ["Text", "Buzzer", "Button"];
  if (newTypes.includes(type)) {
    return `${type}Component`;
  } else {
    return type;
  }
};

const { socket, state } = initializePlayerSocket(router, defaultState);
provide("socket", socket);
</script>

<template>
  <div class="player-wrapper">
    <div class="player-nav--wrapper">
      <div class="player-nav">{{ state.ui.header.text }}</div>
    </div>
    <div class="player-main--wrapper">
      <div class="player-main" v-if="state.ui.main.components">
        <component
          v-for="comp in state.ui.main.components"
          :is="getComponentType(comp.type)"
          :key="comp.key"
          :custom="comp.props"
          class="player-component"
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
  color: v-bind("state.theme.header.textColor");
  background-color: v-bind("state.theme.header.backgroundColor");
}

.player-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 300px;
  max-width: 350px;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
}

.player-main--wrapper {
  display: flex;
  justify-content: center;
  margin-top: -50px;
  height: 100vh;
  max-height: -webkit-fill-available;
  background-color: v-bind("state.theme.main.backgroundColor");
}

.player-main {
  display: flex;
  flex-direction: column;
  justify-content: v-bind("state.ui.main.align");
  margin-top: 60px;
  margin-bottom: 10px;
  width: 100%;
  min-width: 300px;
  max-width: 350px;
}

.player-component {
  margin-top: 10px;
  margin-bottom: 10px;
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
