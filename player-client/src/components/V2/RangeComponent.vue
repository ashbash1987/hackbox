<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { inject, reactive, onMounted, onUnmounted } from "vue";
const socket: Socket = inject("socket") as Socket;

let mountedAt: number;

const defaultProps = {
  event: "range",
  min: 0,
  max: 100,
  step: 1,
  style: {
    color: "black",
    align: "left",
    background: "white",
    border: "2px solid black",
    fontSize: "16px",
    borderRadius: "0px",
  },
};

const customProps = defineProps(["custom"]);
const props = {
  ...defaultProps,
  ...customProps.custom,
  style: { ...defaultProps.style, ...customProps.custom.style },
};

const inputState = reactive({
  value: 0,
  submitted: false,
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") respond();
};

const respond = () => {
  inputState.submitted = true;
  window.removeEventListener("keydown", handleKeydown);
  socket.emit("msg", {
    event: props.event,
    value: String(inputState.value),
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
  <div class="range-input-wrapper">
    <input
      class="range-input"
      type="range"
      v-model="inputState.value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :disabled="inputState.submitted"
    />
    <input
      class="range-text-input"
      type="number"
      v-model="inputState.value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
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
.range-input-wrapper {
  display: flex;
  flex-direction: row;
  border: v-bind("props.style.border");
  border-radius: v-bind("props.style.borderRadius");
  background: v-bind("props.style.background");
}

.range-input {  
  margin: 0;
  padding: 10px 0;
  flex-grow: 1;
}

.range-input:disabled {
  opacity: 0.6;
}

.range-text-input {
  display: flex;
  border: none;
  color: v-bind("props.style.color");
  background: transparent;
  font-size: v-bind("props.style.fontSize");
  margin: 0;
  padding: 10px 5px;
  width: 25%;
  text-align: center;  
}

.range-text-input::-webkit-inner-spin-button {
  opacity:1;
}

.range-text-input:disabled {
  opacity: 0.6;
}

.submit-button {
  font-size: v-bind("props.style.fontSize");
  border: none;
  border-radius: v-bind("props.style.borderRadius");
  background: v-bind("props.style.background");
  padding: 10px;
}

.submit-icon {
  color: v-bind("props.style.color");
}
</style>