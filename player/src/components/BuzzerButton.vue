<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps(["custom"]);
</script>

<template>
  <button class="buzzer-button">{{ props.custom.label }}</button>
</template>

<style scoped>
.buzzer-button {
  color: v-bind("props.custom.textColor");
  background-color: v-bind("props.custom.backgroundColor");
  font-size: 75px;
  height: 500px;
}
</style>
