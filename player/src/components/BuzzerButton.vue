<script setup lang="ts">
import { inject, onMounted, onUnmounted } from "vue";
import type { Socket } from "socket.io-client";

let mountedAt: number;

const socket = inject("socket") as Socket;

const customProps = defineProps(["custom"]);
const defaultProps = {
  label: "BUZZ",
  textColor: "white",
  backgroundColor: "red",
};
const props = { ...defaultProps, ...customProps.custom };

const respond = () => {
  socket.emit("msg", { event: "buzz", ms: Date.now() - mountedAt });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === "Space" || event.code === "Enter") {
    respond();
  }
};

onMounted(() => {
  mountedAt = Date.now();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <button @click="respond" class="buzzer-button">
    {{ props.label }}
  </button>
</template>

<style scoped>
.buzzer-button {
  color: v-bind("props.textColor");
  background-color: v-bind("props.backgroundColor");
  font-size: 75px;
  height: 500px;
  margin: 0;
}
</style>
