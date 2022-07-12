<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { computed, inject, onMounted, onUnmounted, reactive } from "vue";
const socket: Socket = inject("socket") as Socket;

let mountedAt: number;

interface State {
  selection: string | null;
}
const state: State = reactive({
  selection: null,
});

interface Choice {
  label: string;
  value: string;
  keys: string[];
}
const defaultProps = {
  choices: [
    { label: "A: Hydrogen", value: "A", keys: ["A", "1"] },
    { label: "B: Oxygen", value: "B", keys: ["B", "2"] },
  ],
  event: "answer",
  textColor: "black",
  align: "center",
  backgroundColor: "#AAAAAA",
  border: "2px solid black",
  width: "100%",
};

const providedProps = defineProps(["custom"]);
const props = {
  ...defaultProps,
  ...providedProps.custom,
};

const respond = (value: string) => {
  state.selection = value;
  window.removeEventListener("keydown", handleKeydown);
  socket.emit("msg", {
    event: props.event,
    value: value,
    ms: Date.now() - mountedAt,
  });
};

const keystrokes = props.choices.reduce(
  (acc: { [key: string]: string }, choice: Choice) => {
    choice.keys.forEach(
      (key: string) => (acc[key.toLowerCase()] = choice.value)
    );
    return acc;
  },
  {}
);

const selectionMade = computed(() => !!state.selection);

const handleKeydown = (event: KeyboardEvent) => {
  const eventKey = event.key.toLowerCase();
  const responseValue = keystrokes[eventKey];

  if (responseValue) respond(responseValue);
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
  <div class="choices">
    <button
      v-for="choice in props.choices"
      :key="choice.value"
      @click="() => respond(choice.value)"
      :class="`choice ${
        state.selection === choice.value && 'choice--selected'
      } ${
        selectionMade &&
        state.selection !== choice.value &&
        'choice--not-selected'
      }`"
      :disabled="!!state.selection"
    >
      {{ choice.label }}
    </button>
  </div>
</template>

<style scoped>
.choices {
  display: flex;
  flex-direction: column;
}

.choice {
  display: flex;
  width: v-bind("props.width");
  border: v-bind("props.border");
  justify-content: v-bind("props.align");
  color: v-bind("props.textColor");
  background-color: v-bind("props.backgroundColor");
  font-size: 20px;
  padding: 20px;
  margin: 10px 0px;
  border-radius: 10px;
}

.choice--selected {
  color: v-bind("props.hoverTextColor || props.textColor");
  background-color: v-bind(
    "props.hoverBackgroundColor || props.backgroundColor"
  );
}

.choice--not-selected {
  opacity: 0.6;
}

.choice:hover:not(:disabled) {
  color: v-bind("props.hoverTextColor || props.textColor");
  background-color: v-bind(
    "props.hoverBackgroundColor || props.backgroundColor"
  );
}
</style>
