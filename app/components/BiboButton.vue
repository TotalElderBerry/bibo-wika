<script setup lang="ts">
/**
 * The one button. Thick outline, hard drop shadow, and it physically sinks
 * when pressed - the shadow shrinks by exactly the distance the button moves,
 * so it reads as a real object being pushed down onto the page.
 */
withDefaults(
  defineProps<{
    tone?: 'mangga' | 'sili' | 'dahon' | 'ube' | 'papel'
    size?: 'lg' | 'md'
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  { tone: 'mangga', size: 'lg', disabled: false, type: 'button' },
)
</script>

<template>
  <button :type="type" class="bibo-btn lift" :class="[`t-${tone}`, `s-${size}`]" :disabled="disabled">
    <span class="face"><slot /></span>
  </button>
</template>

<style scoped>
.bibo-btn {
  --btn-bg: var(--mangga);
  --btn-fg: var(--tinta);
  display: block;
  width: 100%;
  font-family: var(--display);
  font-weight: 800;
  letter-spacing: -0.005em;
  color: var(--btn-fg);
  background: var(--btn-bg);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  box-shadow: 0 var(--drop) 0 var(--lift);
  transition:
    transform 0.09s var(--ease),
    box-shadow 0.09s var(--ease),
    filter 0.15s var(--ease);
  touch-action: manipulation;
  user-select: none;
}

.s-lg {
  font-size: 22px;
  /* 64px minimum target, spec section 11. */
  min-height: 66px;
  padding: 14px 20px;
}

.s-md {
  font-size: 18px;
  min-height: 54px;
  padding: 10px 18px;
  border-radius: var(--round-sm);
}

.t-mangga { --btn-bg: var(--mangga); }
.t-sili { --btn-bg: var(--sili); --btn-fg: #fff; }
.t-dahon { --btn-bg: var(--dahon); --btn-fg: #fff; }
.t-ube { --btn-bg: var(--ube); --btn-fg: #fff; }
.t-papel { --btn-bg: var(--papel); }

.bibo-btn:hover:not(:disabled) {
  filter: brightness(1.05);
}

.bibo-btn:active:not(:disabled) {
  transform: translateY(var(--drop));
  box-shadow: 0 0 0 var(--lift);
}

.bibo-btn:disabled {
  opacity: 0.45;
  box-shadow: 0 3px 0 var(--lift);
  cursor: default;
}

.face {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
</style>
