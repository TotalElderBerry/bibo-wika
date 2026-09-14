<script setup lang="ts">
/**
 * The buddy. Six at Phase 0, drawn as layered SVG rather than sprite sheets so
 * that recolouring and animating cost nothing - spec section 04.
 *
 * `mood` drives the whole emotional loop of the app:
 *   idle   - gentle float, the resting state
 *   cheer  - a correct answer
 *   think  - a wrong answer. Tilts and blinks. Never sad, never a buzzer.
 *   talk   - currently speaking
 */
import type { BuddyName } from '~/utils/buddies'

const props = withDefaults(
  defineProps<{
    name: BuddyName
    mood?: 'idle' | 'cheer' | 'think' | 'talk'
    size?: number
  }>(),
  { mood: 'idle', size: 120 },
)

const moodClass = computed(() =>
  props.mood === 'cheer'
    ? 'is-cheer'
    : props.mood === 'think'
      ? 'is-wobble'
      : props.mood === 'talk'
        ? 'is-pop'
        : 'is-float',
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 80 80"
    class="buddy"
    :class="moodClass"
    role="img"
    :aria-label="name"
  >
    <!-- Tikoy the tarsier -->
    <g v-if="name === 'tikoy'">
      <ellipse class="ink" cx="21" cy="18" rx="9" ry="10.5" fill="#B79470" />
      <ellipse class="ink" cx="59" cy="18" rx="9" ry="10.5" fill="#B79470" />
      <ellipse cx="21" cy="18.5" rx="4.4" ry="5.6" fill="#8C6A4C" />
      <ellipse cx="59" cy="18.5" rx="4.4" ry="5.6" fill="#8C6A4C" />
      <ellipse class="ink" cx="40" cy="45" rx="26" ry="25" fill="#C9A87F" />
      <path d="M33 23 q7 -6 14 0 q-7 -2.5 -14 0Z" fill="#8C6A4C" />
      <circle class="ink" cx="29" cy="42" r="11" fill="#FFFDF5" />
      <circle class="ink" cx="51" cy="42" r="11" fill="#FFFDF5" />
      <circle cx="29" cy="42" r="6.6" fill="#6B4A22" />
      <circle cx="51" cy="42" r="6.6" fill="#6B4A22" />
      <circle cx="29" cy="42" r="3.4" fill="#1A1408" />
      <circle cx="51" cy="42" r="3.4" fill="#1A1408" />
      <circle cx="26.4" cy="39.2" r="2.4" fill="#fff" />
      <circle cx="48.4" cy="39.2" r="2.4" fill="#fff" />
      <circle cx="40" cy="53" r="2.4" fill="#7A5533" />
      <path d="M36 58 q4 3.5 8 0" stroke="#7A5533" stroke-width="2.6" fill="none" stroke-linecap="round" />
    </g>

    <!-- Kalab the carabao -->
    <g v-else-if="name === 'kalab'">
      <path class="ink" d="M13 30 C3 26 3 12 13 10 C11 18 15 24 23 27Z" fill="#4E4A47" />
      <path class="ink" d="M67 30 C77 26 77 12 67 10 C69 18 65 24 57 27Z" fill="#4E4A47" />
      <ellipse class="ink" cx="40" cy="42" rx="25" ry="24" fill="#8B95A0" />
      <ellipse class="ink" cx="40" cy="54" rx="15" ry="12" fill="#AEB8C2" />
      <ellipse cx="34" cy="53" rx="2.6" ry="3.4" fill="#4A5360" />
      <ellipse cx="46" cy="53" rx="2.6" ry="3.4" fill="#4A5360" />
      <path d="M34 61 q6 4 12 0" stroke="#4A5360" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <circle class="ink" cx="30" cy="35" r="5.2" fill="#fff" />
      <circle class="ink" cx="50" cy="35" r="5.2" fill="#fff" />
      <circle cx="30.8" cy="35.8" r="2.8" fill="#1F242C" />
      <circle cx="50.8" cy="35.8" r="2.8" fill="#1F242C" />
    </g>

    <!-- Haribon the Philippine eagle -->
    <g v-else-if="name === 'haribon'">
      <path
        class="ink"
        d="M40 7 L34 19 L28 11 L26 23 L17 19 L22 30 L58 30 L63 19 L54 23 L52 11 L46 19Z"
        fill="#E4D6B8"
      />
      <ellipse class="ink" cx="40" cy="43" rx="24" ry="23" fill="#F5ECD8" />
      <path d="M17 45 q9 -14 23 -14 q14 0 23 14 q-10 -8 -23 -8 q-13 0 -23 8Z" fill="#C9B893" />
      <circle class="ink" cx="31" cy="40" r="5.4" fill="#fff" />
      <circle class="ink" cx="49" cy="40" r="5.4" fill="#fff" />
      <circle cx="31.8" cy="40.6" r="3" fill="#2A1F10" />
      <circle cx="49.8" cy="40.6" r="3" fill="#2A1F10" />
      <path class="ink" d="M40 46 q7 2 7 8 q0 6 -7 8 q-7 -2 -7 -8 q0 -6 7 -8Z" fill="#FFB020" />
    </g>

    <!-- Pawi the sea turtle -->
    <g v-else-if="name === 'pawi'">
      <ellipse class="ink" cx="13" cy="45" rx="8.5" ry="6" fill="#57AE76" transform="rotate(-22 13 45)" />
      <ellipse class="ink" cx="67" cy="45" rx="8.5" ry="6" fill="#57AE76" transform="rotate(22 67 45)" />
      <path class="ink" d="M40 7 q27 4 27 27 q0 13 -27 15 q-27 -2 -27 -15 q0 -23 27 -27Z" fill="#3F8F5E" />
      <path d="M40 14 q19 4 19 20 q0 9 -19 11 q-19 -2 -19 -11 q0 -16 19 -20Z" fill="#57AE76" />
      <path d="M40 17 L51 27 L47 41 L33 41 L29 27Z" fill="#2E7049" />
      <ellipse class="ink" cx="40" cy="56" rx="16" ry="14" fill="#8CC79E" />
      <circle class="ink" cx="33" cy="54" r="5" fill="#fff" />
      <circle class="ink" cx="47" cy="54" r="5" fill="#fff" />
      <circle cx="33.6" cy="54.6" r="2.8" fill="#1E3A28" />
      <circle cx="47.6" cy="54.6" r="2.8" fill="#1E3A28" />
      <path d="M35 63 q5 4 10 0" stroke="#2E7049" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </g>

    <!-- Maya the bird -->
    <g v-else-if="name === 'maya'">
      <path class="ink" d="M40 12 q7 4 5 11 q-5 -3 -10 0 q-2 -7 5 -11Z" fill="#8A6236" />
      <ellipse class="ink" cx="40" cy="44" rx="24" ry="23" fill="#C08F5C" />
      <path d="M16 44 q24 -22 48 0 q-24 -10 -48 0Z" fill="#8A6236" />
      <ellipse class="ink" cx="40" cy="56" rx="17" ry="11" fill="#EBD8B8" />
      <circle class="ink" cx="30" cy="39" r="5.6" fill="#fff" />
      <circle class="ink" cx="50" cy="39" r="5.6" fill="#fff" />
      <circle cx="30.8" cy="39.6" r="3.1" fill="#241708" />
      <circle cx="50.8" cy="39.6" r="3.1" fill="#241708" />
      <path class="ink" d="M33 50 L47 50 L40 60Z" fill="#FFB020" />
    </g>

    <!-- Sari the sarimanok -->
    <g v-else>
      <path class="ink" d="M40 8 q-4 11 -15 13 q13 2 15 13 q2 -11 15 -13 q-11 -2 -15 -13Z" fill="#FFB020" />
      <path class="ink" d="M13 41 q-7 -15 4 -23 q2 13 13 15Z" fill="#FF6B4A" />
      <path class="ink" d="M67 41 q7 -15 -4 -23 q-2 13 -13 15Z" fill="#19A8A5" />
      <ellipse class="ink" cx="40" cy="46" rx="22" ry="21" fill="#E85A3C" />
      <path d="M18 46 q22 -16 44 0 q-22 -6 -44 0Z" fill="#FF8264" />
      <circle class="ink" cx="31" cy="42" r="5.4" fill="#fff" />
      <circle class="ink" cx="49" cy="42" r="5.4" fill="#fff" />
      <circle cx="31.8" cy="42.6" r="3" fill="#33110C" />
      <circle cx="49.8" cy="42.6" r="3" fill="#33110C" />
      <path class="ink" d="M33 52 L47 52 L40 63Z" fill="#FFB020" />
    </g>
  </svg>
</template>

<style scoped>
.buddy {
  display: block;
  overflow: visible;
}

/* One stroke rule gives every buddy the same sticker weight. */
.buddy :deep(.ink) {
  stroke: var(--linya);
  stroke-width: 2.6;
  stroke-linejoin: round;
  paint-order: stroke fill;
}
</style>
