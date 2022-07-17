<script setup lang="ts">
import type { Socket } from "socket.io-client";
import { inject, onMounted, onUnmounted, reactive } from "vue";
const socket: Socket = inject("socket") as Socket;

let mountedAt: number;

interface Choice {
  label: string;
  value: string;
  keys: string[];
  selected?: boolean;
}

const defaultProps = {
  event: "answer",
  multiSelect: false,
  choices: [
    { label: "A: Hydrogen", value: "A", keys: ["A", "1"] },
    { label: "B: Oxygen", value: "B", keys: ["B", "2"] },
  ],
  submit: {
    label: "Submit",
  },
  hover: {
    color: "black",
    background: "#AAAAAA",
  },
  color: "black",
  align: "center",
  background: "#AAAAAA",
  border: "2px solid black",
  width: "100%",
  fontSize: "20px",
  padding: "20px",
  margin: "10px 0px",
  borderRadius: "10px",
};

const providedProps = defineProps(["custom"]);
const props = {
  ...defaultProps,
  ...providedProps.custom,
};

interface State {
  choices: Choice[];
  selections: string[];
  submitted: boolean;
}

const state: State = reactive({
  choices: props.choices.map((choice: Choice) => ({
    ...choice,
    selected: false,
  })),
  selections: [],
  submitted: false,
});

const submitResponse = () => {
  state.submitted = true;
  window.removeEventListener("keydown", handleKeydown);
  const response = props.multiSelect ? state.selections : state.selections[0];

  socket.emit("msg", {
    event: props.event,
    value: response,
    ms: Date.now() - mountedAt,
  });
};

const isSelected = (value: string) => state.selections.includes(value);

const addSelection = (value: string) => {
  state.selections.push(value);
};

const removeSelection = (value: string) => {
  const index = state.selections.indexOf(value);
  if (index === -1) return;

  state.selections.splice(index, 1);
};

const toggleSelection = (value: string) => {
  state.selections.includes(value)
    ? removeSelection(value)
    : addSelection(value);

  if (state.selections.length === 0) return;
  if (props.multiSelect) return;
  submitResponse();
};

const choicesKeystrokes = props.choices.reduce(
  (acc: { [key: string]: string }, choice: Choice) => {
    choice.keys.forEach(
      (key: string) => (acc[key.toLowerCase()] = choice.value)
    );
    return acc;
  },
  {}
);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") submitResponse();

  const eventKey = event.key.toLowerCase();
  const responseValue = choicesKeystrokes[eventKey];

  if (responseValue) toggleSelection(responseValue);
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
      v-for="choice in state.choices"
      :key="choice.value"
      @click="() => toggleSelection(choice.value)"
      :class="`choice ${isSelected(choice.value) && 'choice--selected'}`"
      :disabled="state.submitted"
    >
      {{ choice.label }}
    </button>
    <button
      v-if="props.multiSelect"
      @click="submitResponse"
      class="submit-button"
      :disabled="state.submitted"
    >
      {{ props.submit.label }}
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
  color: v-bind("props.color");
  background: v-bind("props.background");
  font-size: v-bind("props.fontSize");
  padding: v-bind("props.padding");
  margin: v-bind("props.margin");
  border-radius: v-bind("props.borderRadius");
}

.choice--selected {
  color: v-bind("props.hover.color || props.color");
  background: v-bind("props.hover.background || props.hover.background");
}

.choice--not-selected {
  opacity: 0.6;
}

.choice:hover:not(:disabled) {
  color: v-bind("props.hover.color || props.hover.color");
  background: v-bind("props.hover.background || props.hover.background");
}

.choice:disabled {
  opacity: 0.6;
}

.choice--not-selected {
  opacity: 0.6;
}

.submit-button {
  display: flex;
  width: v-bind("props.submit.width || props.width");
  border: v-bind("props.submit.border || props.border");
  justify-content: v-bind("props.submit.align || props.align");
  color: v-bind("props.submit.color || props.color");
  background: v-bind("props.submit.background || props.background");
  font-size: v-bind("props.submit.fontSize || props.fontSize");
  padding: v-bind("props.submit.padding || props.padding");
  margin: v-bind("props.submit.margin || props.margin");
  border-radius: v-bind("props.submit.borderRadius || props.borderRadius");
}

.submit-button--selected {
  color: v-bind("props.submit.color || props.color");
  background: v-bind("props.submit.background || props.submit.background");
}

.submit-button:hover:not(:disabled) {
  color: v-bind("props.hover.color || props.hover.color");
  background: v-bind("props.hover.background || props.hover.background");
}

.submit-button:disabled {
  opacity: 0.6;
}
</style>
