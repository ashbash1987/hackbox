<script setup lang="ts">
import router from "@/router";
import initializeViewerSocket from "@/lib/sockets/viewerSocket";

const { state } = initializeViewerSocket(router);
</script>

<template v-if="state !== {}">
  <pre>{{ state }}</pre>
</template>

<style></style>
