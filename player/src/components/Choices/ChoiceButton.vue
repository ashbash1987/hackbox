<!-- eslint-disable vue/require-valid-default-prop -->
<!-- eslint-disable @typescript-eslint/no-empty-function -->

<script setup lang="ts">
import { reactive, onUnmounted, onMounted } from "vue";

interface State {
  selected: boolean;
}

const state: State = reactive({
  selected: false,
});

interface StyleProps {
  color: string;
  align: string;
  background: string;
  border: string;
  width: string;
  fontSize: string;
  padding: string;
  margin: string;
  borderRadius: string;
  hover: StyleProps;
}

interface Props {
  label: string;
  keys: string[];
  style: StyleProps;
  onSelect: () => void;
}

const defaultProps = {
  style: {
    color: "black",
    align: "center",
    background: "#AAAAAA",
    border: "2px solid black",
    width: "100%",
    fontSize: "20px",
    padding: "20px",
    margin: "10px 0px",
    borderRadius: "10px",
    hover: {
      color: "black",
      background: "#AAAAAA",
    },
  },
};

const customProps = withDefaults(defineProps<Props>(), {
  onSelect: () => {},
  label: "",
  keys: [],
  style: {},
});

const props = {
  ...defaultProps,
  ...customProps,
  style: {
    ...defaultProps.style,
    ...(customProps.style || {}),
    hover: {
      ...defaultProps.style.hover,
      ...(customProps.style?.hover || {}),
    },
  },
};

const handleKeydown = (event: KeyboardEvent) => {
  const eventKey = event.key.toLowerCase();
  if (props.keys.map((k: string) => k.toLowerCase()).includes(eventKey)) {
    handleSelect();
  }
};

const handleSelect = () => {
  state.selected = !state.selected;
  props.onSelect();
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <button
    @click="handleSelect"
    :class="`choice ${state.selected ? 'choice--selected' : ''}`"
  >
    {{ props.label }}
  </button>
</template>

<style scoped>
.choice {
  display: flex;
  width: v-bind("props.style.width");
  border: v-bind("props.style.border");
  justify-content: v-bind("props.style.align");
  color: v-bind("props.style.color");
  background: v-bind("props.style.background");
  font-size: v-bind("props.style.fontSize");
  padding: v-bind("props.style.padding");
  margin: v-bind("props.style.margin");
  border-radius: v-bind("props.style.borderRadius");
}

.choice--selected {
  color: v-bind("props.style.hover.color || props.style.color");
  background: v-bind(
    "props.style.hover.background || props.style.hover.background"
  );
}

.choice--not-selected {
  opacity: 0.6;
}

.choice:hover:not(:disabled) {
  cursor: pointer;
  color: v-bind("props.style.hover.color || props.style.hover.color");
  background: v-bind(
    "props.style.hover.background || props.style.hover.background"
  );
}

.choice:disabled {
  opacity: 0.6;
}

.choice--not-selected {
  opacity: 0.6;
}
</style>
