<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { inject } from "vue";
const socket: Socket = inject("socket") as Socket;

const customProps = defineProps(["custom"]);
const defaultProps = {
  label: "BUZZ",
  textColor: "white",
  backgroundColor: "red",
};
const props = { ...defaultProps, ...customProps.custom };

const receivedAt = Date.now();
const respond = () => {
  socket.emit("msg", { event: "buzz", ms: Date.now() - receivedAt });
};
</script>

<template>
  <button @click="respond" class="buzzer-button">{{ props.label }}</button>
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
