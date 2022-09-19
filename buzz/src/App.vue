<script setup lang="ts">
import { RouterView } from "vue-router";
import { getUserId } from "@/lib/browserStorage";

getUserId();
</script>

<template>
  <Suspense>
    <template #default><RouterView /></template>
  </Suspense>
</template>

<style>
body {
  margin: 0;
  box-sizing: border-box;
  font-family: Helvetica, sans-serif;
}
</style>
