<script setup lang="ts">
const customProps = defineProps(["custom"]);
const defaultProps = {
  label: "BUZZ",
  textColor: "white",
  backgroundColor: "red",
};
const props = { ...defaultProps, ...customProps.custom };
</script>

<template>
  <button class="buzzer-button">{{ props.label }}</button>
</template>

<style scoped>
.buzzer-button {
  color: v-bind("props.textColor");
  background-color: v-bind("props.backgroundColor");
  font-size: 75px;
  height: 500px;
  margin: 0;
}
</style>
