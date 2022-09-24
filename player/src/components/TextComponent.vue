<script setup lang="ts">
const customProps = defineProps(["custom"]);

const defaultProps = {
  text: "Sample Text",
  style: {
    background: "white",
    border: "4px solid black",
    color: "black",
    align: "center",
  },
};

const props = {
  ...defaultProps,
  ...customProps.custom,
  style: {
    ...defaultProps.style,
    ...customProps.custom?.style,
  },
};
</script>

<template>
  <div class="textbox">
    <p>{{ props.text }}</p>
  </div>
</template>

<style scoped>
.textbox {
  display: flex;
  padding: 10px;
  border-radius: 10px;
  justify-content: v-bind("props.style.align");
  text-align: v-bind("props.style.align");
  color: v-bind("props.style.color");
  background: v-bind("props.style.background");
  border: v-bind("props.style.border");
}
</style>
