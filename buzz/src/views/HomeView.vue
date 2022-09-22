<script setup lang="ts"></script>

<template>
  <header>
    <div class="header">BUZZ! by hackbox</div>
  </header>
  <main>
    This route will create a game with the settings provided. Then it will
    connect to hackbox. It will then provide the gameId with the room code.
    <button>Create game</button>
  </main>
  <footer>Made with ❤️ by devdev, 2022</footer>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  background-color: black;
  color: white;
  width: 100%;
}
</style>
