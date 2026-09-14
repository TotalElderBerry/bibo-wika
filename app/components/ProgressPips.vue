<script setup lang="ts">
/**
 * Chunky pips, not a thin bar. A four-year-old can count how many are left;
 * a progress bar at 62% means nothing to them.
 */
defineProps<{ total: number; done: number }>()
</script>

<template>
  <div class="pips" role="progressbar" :aria-valuenow="done" :aria-valuemin="0" :aria-valuemax="total">
    <span v-for="i in total" :key="i" class="pip" :class="{ filled: i <= done }" />
  </div>
</template>

<style scoped>
.pips {
  display: flex;
  gap: 6px;
  align-items: center;
}

.pip {
  flex: 1;
  height: 16px;
  min-width: 12px;
  border: 2.5px solid var(--linya);
  border-radius: 999px;
  background: var(--papel);
  transition: background-color 0.25s var(--spring);
}

.pip.filled {
  background: var(--dahon);
}
</style>
