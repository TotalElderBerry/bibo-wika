<script setup lang="ts">
/**
 * A choice in Pakinggan at Pindutin. Picture first, word small underneath for
 * a parent to read aloud - in Usbong the word is never the thing being tested.
 *
 * A wrong tap wobbles and stays available. There is no buzzer, no lost life
 * and no locked-out state: spec section 02.
 */
withDefaults(
  defineProps<{
    art: string
    word: string
    state?: 'idle' | 'correct' | 'wrong'
    frozen?: boolean
    /** Keyboard shortcut number, shown only on a desktop pointer. */
    hint?: number
  }>(),
  { state: 'idle', frozen: false, hint: undefined },
)
</script>

<template>
  <button
    class="tap lift"
    :class="[`is-${state}`, { frozen }]"
    :disabled="frozen && state === 'idle'"
    :aria-label="word"
  >
    <span v-if="hint" class="key hint" aria-hidden="true">{{ hint }}</span>
    <span class="pic" :class="{ 'is-pop': state === 'correct', 'is-wobble': state === 'wrong' }">
      <AnimalArt :art="art" :size="76" />
    </span>
    <span class="label">{{ word }}</span>

    <span v-if="state === 'correct'" class="mark ok" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20">
        <path d="M4 13 L10 19 L20 6" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </button>
</template>

<style scoped>
.tap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  /* Well past the 64px floor - these are the primary targets in the app. */
  min-height: 148px;
  padding: 14px 8px 10px;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  box-shadow: 0 var(--drop) 0 var(--lift);
  transition:
    transform 0.1s var(--ease),
    box-shadow 0.1s var(--ease),
    background-color 0.2s var(--ease),
    opacity 0.2s var(--ease);
  touch-action: manipulation;
}

.tap:active:not(:disabled) {
  transform: translateY(var(--drop));
  box-shadow: 0 0 0 var(--lift);
}

.label {
  font-family: var(--display);
  font-size: 19px;
  font-weight: 800;
  color: var(--tinta);
}

.is-correct {
  background: var(--dahon);
}
.is-correct .label {
  color: #fff;
}

.is-wrong {
  background: var(--papel-2);
}

/* Dim the untouched cards once the child has answered, so the eye goes to the
   one that lit up green - without hiding anything. */
.frozen.is-idle {
  opacity: 0.45;
}

.mark {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: var(--edge) solid var(--linya);
  animation: bibo-pop 0.4s var(--spring);
}

.mark.ok {
  background: var(--dahon-2);
}

/* The hint sits in the corner the check mark does not use. */
.hint {
  position: absolute;
  top: 8px;
  left: 8px;
}

@media (min-width: 700px) {
  .tap {
    min-height: 180px;
    gap: 6px;
  }
  .pic :deep(svg) {
    width: 92px;
    height: 92px;
  }
  .label {
    font-size: 21px;
  }
}

@media (min-width: 1024px) {
  .tap {
    min-height: 208px;
    padding: 18px 10px 14px;
  }
  .pic :deep(svg) {
    width: 104px;
    height: 104px;
  }
  .label {
    font-size: 23px;
  }
}
</style>
