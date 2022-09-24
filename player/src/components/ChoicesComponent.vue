<script setup lang="ts">
import ChoiceButton from "./Choices/ChoiceButton.vue";
import type { Socket } from "socket.io-client";
import { inject, onMounted, onUnmounted, reactive, ref } from "vue";
const socket: Socket = inject("socket") as Socket;

let mountedAt: number;

interface Choice {
  label: string;
  value: string;
  keys: string[];
  style?: object;
  selected?: boolean;
}

const defaultProps = {
  event: "answer",
  multiSelect: false,
  choices: [
    {
      label: "A: Hydrogen",
      value: "A",
      keys: ["A", "1"],
      style: {
        hover: {},
      },
    },
  ],
  submit: {
    label: "Submit",
    style: {
      margin: "50px 0px",
      hover: {},
    },
  },
  style: {
    hover: {},
  },
};

const customProps = defineProps(["custom"]);
const props = {
  ...defaultProps,
  ...customProps.custom,
  submit: {
    ...defaultProps.submit,
    ...(customProps.custom?.submit || {}),
    style: {
      ...defaultProps.style,
      ...defaultProps.submit.style,
      ...(customProps.custom?.style || {}),
      ...(customProps.custom?.submit?.style || {}),
      hover: {
        ...defaultProps.style.hover,
        ...defaultProps.submit.style.hover,
        ...(customProps.custom?.style?.hover || {}),
        ...(customProps.custom?.submit?.style?.hover || {}),
      },
    },
  },
  style: {
    ...defaultProps.style,
    ...(customProps.custom?.style || {}),
    hover: {
      ...defaultProps.style.hover,
      ...(customProps.custom?.style?.hover || {}),
    },
  },
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
    <choice-button
      v-for="choice in state.choices"
      :key="choice.value"
      :onSelect="() => toggleSelection(choice.value)"
      :disabled="state.submitted"
      :label="choice.label"
      :keys="choice.keys"
      :style="{ ...props.style, ...choice.style }"
    ></choice-button>
    <choice-button
      v-if="props.multiSelect"
      key="submit-button"
      :onSelect="submitResponse"
      :disabled="state.submitted"
      :label="props.submit.label"
      :style="{ ...props.style, ...props.submit.style }"
    ></choice-button>
  </div>
</template>

<style scoped>
.choices {
  display: flex;
  flex-direction: column;
}
</style>
