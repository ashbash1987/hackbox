<script setup lang="ts">
const customProps = defineProps(["custom"]);

const defaultProps = {
  background: "white",
  border: "4px solid black",
  color: "black",
  align: "center",
};

const props = { ...defaultProps, ...customProps.custom };
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
  justify-content: v-bind("props.align");
  text-align: v-bind("props.align");
  color: v-bind("props.color");
  background: v-bind("props.background");
  border: v-bind("props.border");
}
</style>
