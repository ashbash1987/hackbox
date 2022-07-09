<script setup lang="ts">
import { createRoom } from "@/lib/rooms";
import router from "@/router";

const startTestGame = async () => {
  const roomCode = await createRoom();
  router.push(`/test/${roomCode}`);
};

const startBzzrGame = async () => {
  const roomCode = await createRoom();
  router.push(`/bzzr/${roomCode}`);
};
</script>

<template>
  <button @click="startTestGame">Test Room</button>
  <button @click="startBzzrGame">BZZR</button>
</template>

<style scoped>
.lobby-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.lobby-nav--wrapper {
  display: flex;
  justify-content: center;
  height: 50px;
  color: white;
  background-color: #4254f4;
}

.lobby-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: 300px;
  max-width: 350px;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
}

.lobby-main--wrapper {
  display: flex;
  justify-content: center;
}

.lobby-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-width: 300px;
  max-width: 350px;
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
