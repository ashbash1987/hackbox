<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  getRoomCode,
  getUserName,
  setRoomCode,
  setUserName,
} from "@/lib/browserStorage";
import router from "@/router";
import roomExists from "@/lib/roomExists";
import config from "@/config";

const updateRoomExists = async () => {
  const roomCode = getRoomCode();
  state.roomExists = roomCode.length !== 4 ? false : await roomExists(roomCode);
};

const setRoomCodeFromInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newRoomCode = target.value;
  state.roomCode = newRoomCode;
  setRoomCode(newRoomCode);
  updateRoomExists();
};

const setUserNameFromInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newUserName = target.value;
  state.userName = newUserName;
  setUserName(newUserName);
};

const canJoin = computed(() => {
  if (state.userName.length === 0) return false;
  if (state.userName.length > 12) return false;
  return state.roomExists;
});

const joinGame = () => {
  router.push("/play");
};

const state = reactive({
  roomCode: getRoomCode(),
  userName: getUserName(),
  roomExists: false,
});

updateRoomExists();
</script>

<template>
  <div class="lobby-wrapper">
    <nav class="lobby-nav--wrapper">
      <div class="lobby-nav">
        <div class="lobby-nav--left"></div>
        <div class="lobby-nav--center">hackbox.ca</div>
        <div class="lobby-nav--right"></div>
      </div>
    </nav>
    <section class="lobby-main--wrapper">
      <div class="lobby-main">
        <div class="input-area">
          <label>ROOM CODE</label>
          <input
            class="lobby-text-input"
            type="text"
            maxlength="4"
            :value="state.roomCode"
            @input="setRoomCodeFromInput"
          />
        </div>

        <div class="input-area">
          <label>NAME</label>
          <input
            class="lobby-text-input"
            type="text"
            maxlength="12"
            :value="state.userName"
            @input="setUserNameFromInput"
          />
        </div>

        <button @click="joinGame" :disabled="!canJoin">PLAY</button>

        <a class="host-link" :href="config.hostUri">Host your own game</a>
      </div>
    </section>
  </div>
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
  background: #4254f4;
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

.lobby-text-input {
  border: 0;
  font-size: 18px;
  background: #dddddd;
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
  background: #4254f4;
  opacity: 0.9;
  transition: color 0.2s, background 0.2s, opacity 0.2s;
}

button:disabled {
  color: #777777;
  background: #eeeeee;
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
