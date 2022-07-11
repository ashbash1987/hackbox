<script setup lang="ts">
const customProps = defineProps(["custom"]);

const defaultProps = {
  backgroundColor: "white",
  border: "4px solid black",
  textColor: "black",
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
  color: v-bind("props.textColor");
  background-color: v-bind("props.backgroundColor");
  border: v-bind("props.border");
}
</style>
