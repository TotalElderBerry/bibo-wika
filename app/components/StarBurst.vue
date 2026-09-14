<script setup lang="ts">
/**
 * The reward. Fires on a correct answer - deliberately short, so the loop stays
 * fast and a child gets more turns per minute rather than more confetti.
 */
const props = defineProps<{ show: boolean }>()

const bits = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2
  return {
    x: Math.round(Math.cos(angle) * 120),
    y: Math.round(Math.sin(angle) * 120),
    hue: ['var(--mangga)', 'var(--sili)', 'var(--dahon)', 'var(--ube)', 'var(--rosas)'][i % 5],
    delay: (i % 4) * 30,
  }
})

const key = ref(0)
watch(
  () => props.show,
  (v) => {
    if (v) key.value++
  },
)
</script>

<template>
  <div v-if="show" :key="key" class="burst" aria-hidden="true">
    <span
      v-for="(b, i) in bits"
      :key="i"
      class="bit"
      :style="{
        '--tx': `${b.x}px`,
        '--ty': `${b.y}px`,
        '--bg': b.hue,
        animationDelay: `${b.delay}ms`,
      }"
    />
  </div>
</template>

<style scoped>
.burst {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 5;
}

.bit {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 5px;
  border: 2.5px solid var(--linya);
  background: var(--bg);
  animation: fly 0.72s var(--ease) forwards;
}

@keyframes fly {
  0% {
    transform: translate(0, 0) scale(0.3) rotate(0deg);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(1) rotate(220deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bit {
    display: none;
  }
}
</style>
