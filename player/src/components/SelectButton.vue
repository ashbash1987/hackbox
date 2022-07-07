<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { inject } from "vue";
const socket: Socket = inject("socket") as Socket;

const defaultProps = {
  label: "A: 42",
  textColor: "black",
  align: "center",
  backgroundColor: "#AAAAAA",
  borderColor: "black",
};

const providedProps = defineProps(["custom", "socket"]);
const props = {
  ...defaultProps,
  ...providedProps.custom,
};

const respond = () => {
  socket.emit("msg", { value: props.value });
};
</script>

<template>
  <button @click="respond" class="select-button">{{ props.label }}</button>
</template>

<style scoped>
.select-button {
  display: flex;
  border: 2px solid v-bind("props.borderColor");
  justify-content: v-bind("props.align");
  color: v-bind("props.textColor");
  background-color: v-bind("props.backgroundColor");
  font-size: 20px;
  margin: 0;
}

.select-button:hover {
  color: v-bind("props.hoverTextColor || props.textColor");
  background-color: v-bind(
    "props.hoverBackgroundColor || props.backgroundColor"
  );
}
</style>
