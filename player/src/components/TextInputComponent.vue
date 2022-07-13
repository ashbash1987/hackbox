<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { inject, reactive, onMounted, onUnmounted } from "vue";
const socket: Socket = inject("socket") as Socket;

let mountedAt: number;

const defaultProps = {
  event: "text",
  textColor: "black",
  align: "left",
  backgroundColor: "white",
  border: "2px solid black",
  fontSize: "30px",
};

const providedProps = defineProps(["custom"]);
const props = {
  ...defaultProps,
  ...providedProps.custom,
};

const inputState = reactive({
  value: "",
  submitted: false,
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === "Enter") respond();
};

const respond = () => {
  if (inputState.value.length === 0) return;
  inputState.submitted = true;
  window.removeEventListener("keydown", handleKeydown);
  socket.emit("msg", {
    event: props.event,
    value: inputState.value,
    ms: Date.now() - mountedAt,
  });
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
  <div class="text-input-wrapper">
    <input
      class="text-input"
      v-model="inputState.value"
      :disabled="inputState.submitted"
    />
    <button @click="respond" class="submit-button">
      <font-awesome-icon
        v-if="inputState.submitted"
        class="submit-icon"
        icon="fa-solid fa-check"
      />
      <font-awesome-icon
        v-if="!inputState.submitted"
        class="submit-icon"
        icon="fa-solid fa-paper-plane"
      />
    </button>
  </div>
</template>

<style scoped>
.text-input-wrapper {
  display: flex;
  flex-direction: row;
  border: v-bind("props.border");
  background-color: v-bind("props.backgroundColor");
}

.text-input {
  border: none;
  color: v-bind("props.textColor");
  background-color: transparent;
  font-size: v-bind("props.fontSize");
  margin: 0;
  width: 100%;
  padding: 10px;
  flex-grow: 1;
}

.text-input:disabled {
  opacity: 0.6;
}

.submit-button {
  font-size: v-bind("props.fontSize");
  border: none;
  background-color: v-bind("props.backgroundColor");
  padding: 10px;
}

.submit-icon {
  color: v-bind("props.textColor");
}
</style>
