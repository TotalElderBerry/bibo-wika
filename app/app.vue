<script setup lang="ts">
const profile = useProfile()
onMounted(() => profile.load())
</script>

<template>
  <NuxtPage />
</template>
