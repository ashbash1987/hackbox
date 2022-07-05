<script setup lang="ts">
import { defineProps } from "vue";
const customProps = defineProps(["custom"]);

const defaultProps = {
  label: "A: 42",
  textColor: "black",
  align: "center",
  backgroundColor: "#AAAAAA",
  borderColor: "black",
};
const props = { ...defaultProps, ...customProps.custom };
</script>

<template>
  <button class="select-button">{{ props.label }}</button>
</template>

<style scoped>
.select-button {
  display: flex;
  border: 2px solid v-bind("props.borderColor");
  text-align: v-bind("props.align");
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
