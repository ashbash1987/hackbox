<script setup lang="ts">
import { RouterView } from "vue-router";
import { getUserId } from "@/lib/browserStorage";

getUserId();
</script>

<template>
  <RouterView />
</template>

<style>
@font-face {
  font-family: "FredokaOne";
  src: local("FredokaOne"), url(./fonts/FredokaOne.ttf) format("truetype");
}

body {
  margin: 0;
  box-sizing: border-box;
  font-family: Helvetica, sans-serif;
}
</style>
