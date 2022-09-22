<script setup lang="ts">
import GameState from "@/lib/GameState";
import router from "@/router";
import { ref } from "vue";

const savedGames = GameState.getAll();
const existingGameId = ref("");
const newGameId = ref("");

const startGame = (gameId: string) => {
  router.push(`/${gameId}`);
};
</script>

<template>
  <header>
    <div class="header">buzz! by hackbox</div>
  </header>
  <main>
    <div class="form">
      <div class="new_game_form">
        <label for="new-game-id">Start a new game</label>
        <input v-model="newGameId" id="new-game-id" placeholder="Game title" />

        <button :onClick="() => startGame(newGameId)">Start</button>
      </div>

      <div v-if="savedGames.length" class="existing_game_form">
        <label for="games">Continue a game</label>
        <select v-model="existingGameId" id="existing-game-ids">
          <option v-for="id in savedGames" v-bind:key="id">{{ id }}</option>
        </select>

        <button :onClick="() => startGame(existingGameId)">Continue</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  background-color: purple;
  color: white;
  width: 100%;
  height: 50px;
  align-items: center;
  font-size: 28px;
  font-weight: 700;
}

main {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.existing_game_form {
  display: flex;
  flex-direction: column;
}

.new_game_form {
  display: flex;
  flex-direction: column;
}

.form {
  display: flex;
  flex-direction: column;
}

button {
  font-size: 16px;
  width: 200px;
  margin: 10px 0 20px 0;
}
</style>
