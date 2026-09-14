<script setup lang="ts">
/**
 * Concept artwork for the Hayop topic. One drawing per CONCEPT, shared by all
 * four languages - which is the whole point of a concept-keyed content model:
 * a dog is a dog whether the child is being taught `aso`, `iro` or `ido`.
 *
 * Same sticker weight as the buddies so the two sit together on a card.
 */
withDefaults(defineProps<{ art: string; size?: number }>(), { size: 72 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 80 80" class="art" aria-hidden="true">
    <!-- aso / iro / ido -->
    <g v-if="art === 'dog'">
      <ellipse class="ink" cx="18" cy="33" rx="8" ry="13" fill="#8A6236" transform="rotate(-18 18 33)" />
      <ellipse class="ink" cx="62" cy="33" rx="8" ry="13" fill="#8A6236" transform="rotate(18 62 33)" />
      <ellipse class="ink" cx="40" cy="44" rx="23" ry="22" fill="#C79B63" />
      <ellipse class="ink" cx="40" cy="55" rx="13" ry="10" fill="#EFDDBE" />
      <circle class="ink" cx="31" cy="39" r="5" fill="#fff" />
      <circle class="ink" cx="49" cy="39" r="5" fill="#fff" />
      <circle cx="31.6" cy="39.6" r="2.8" fill="#231A0F" />
      <circle cx="49.6" cy="39.6" r="2.8" fill="#231A0F" />
      <ellipse class="ink" cx="40" cy="51" rx="4.4" ry="3.4" fill="#3A2A18" />
      <path d="M40 55 L40 58 M40 58 q-4 3 -7 0 M40 58 q4 3 7 0" stroke="#3A2A18" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- pusa / iring / kuring -->
    <g v-else-if="art === 'cat'">
      <path class="ink" d="M18 34 L16 13 L33 26Z" fill="#7C7874" />
      <path class="ink" d="M62 34 L64 13 L47 26Z" fill="#7C7874" />
      <ellipse class="ink" cx="40" cy="44" rx="23" ry="21" fill="#948F8A" />
      <path d="M22 30 q18 -8 36 0" stroke="#6B6763" stroke-width="3" fill="none" stroke-linecap="round" />
      <ellipse class="ink" cx="31" cy="41" rx="4.8" ry="6" fill="#D8E06A" />
      <ellipse class="ink" cx="49" cy="41" rx="4.8" ry="6" fill="#D8E06A" />
      <ellipse cx="31" cy="41" rx="1.8" ry="5" fill="#20221A" />
      <ellipse cx="49" cy="41" rx="1.8" ry="5" fill="#20221A" />
      <path class="ink" d="M36 51 L44 51 L40 56Z" fill="#FF8FB1" />
      <path d="M40 56 q-4 4 -8 1 M40 56 q4 4 8 1" stroke="#3E3A37" stroke-width="2" fill="none" stroke-linecap="round" />
      <path d="M13 49 L26 51 M13 57 L26 54 M67 49 L54 51 M67 57 L54 54" stroke="#EFEAE4" stroke-width="1.8" stroke-linecap="round" />
    </g>

    <!-- manok -->
    <g v-else-if="art === 'chicken'">
      <path class="ink" d="M30 20 q2 -8 6 -4 q3 -8 7 -3 q4 -6 7 1 q2 5 -2 8Z" fill="#FF6B4A" />
      <ellipse class="ink" cx="40" cy="46" rx="23" ry="22" fill="#FFF6E2" />
      <path class="ink" d="M40 60 q-5 6 -10 4 q3 -5 3 -9Z" fill="#FF6B4A" />
      <circle class="ink" cx="31" cy="42" r="5" fill="#fff" />
      <circle class="ink" cx="49" cy="42" r="5" fill="#fff" />
      <circle cx="31.6" cy="42.6" r="2.8" fill="#2A2140" />
      <circle cx="49.6" cy="42.6" r="2.8" fill="#2A2140" />
      <path class="ink" d="M33 51 L47 51 L40 60Z" fill="#FFB020" />
    </g>

    <!-- isda / ikan -->
    <g v-else-if="art === 'fish'">
      <path class="ink" d="M66 24 L66 56 L48 40Z" fill="#FF8264" />
      <ellipse class="ink" cx="34" cy="40" rx="24" ry="19" fill="#FF6B4A" />
      <path d="M34 21 q-10 19 0 38 q10 -19 0 -38Z" fill="#FFB020" opacity=".9" />
      <path class="ink" d="M34 21 q7 5 7 19 q0 14 -7 19" fill="none" stroke-width="2.4" />
      <circle class="ink" cx="20" cy="36" r="5.4" fill="#fff" />
      <circle cx="19.4" cy="36.4" r="3" fill="#2A2140" />
      <path d="M12 45 q6 3 11 1" stroke="#C4422A" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <circle cx="45" cy="34" r="2.6" fill="#FFD98A" />
      <circle cx="45" cy="46" r="2.6" fill="#FFD98A" />
    </g>

    <!-- ibon / langgam / billit / pispis -->
    <g v-else-if="art === 'bird'">
      <path class="ink" d="M40 11 q6 4 4 10 q-4 -3 -8 0 q-2 -6 4 -10Z" fill="#1E7FA8" />
      <ellipse class="ink" cx="40" cy="45" rx="23" ry="22" fill="#3FA9CC" />
      <ellipse class="ink" cx="40" cy="56" rx="16" ry="10" fill="#BEE7F4" />
      <path class="ink" d="M62 42 q8 6 4 14 q-7 -2 -10 -9Z" fill="#1E7FA8" />
      <circle class="ink" cx="31" cy="41" r="5.4" fill="#fff" />
      <circle class="ink" cx="49" cy="41" r="5.4" fill="#fff" />
      <circle cx="31.6" cy="41.6" r="3" fill="#132C3A" />
      <circle cx="49.6" cy="41.6" r="3" fill="#132C3A" />
      <path class="ink" d="M33 50 L47 50 L40 59Z" fill="#FFB020" />
    </g>

    <!-- kalabaw / kabaw / nuang / karabaw -->
    <g v-else-if="art === 'carabao'">
      <path class="ink" d="M12 31 C2 27 2 12 12 10 C10 18 14 25 22 28Z" fill="#4E4A47" />
      <path class="ink" d="M68 31 C78 27 78 12 68 10 C70 18 66 25 58 28Z" fill="#4E4A47" />
      <ellipse class="ink" cx="40" cy="43" rx="25" ry="24" fill="#7F8994" />
      <ellipse class="ink" cx="40" cy="55" rx="15" ry="12" fill="#A8B2BC" />
      <ellipse cx="34" cy="54" rx="2.6" ry="3.4" fill="#49525E" />
      <ellipse cx="46" cy="54" rx="2.6" ry="3.4" fill="#49525E" />
      <circle class="ink" cx="30" cy="36" r="5" fill="#fff" />
      <circle class="ink" cx="50" cy="36" r="5" fill="#fff" />
      <circle cx="30.8" cy="36.6" r="2.8" fill="#1F242C" />
      <circle cx="50.8" cy="36.6" r="2.8" fill="#1F242C" />
    </g>

    <!-- pagong / bao / pag-ong -->
    <g v-else-if="art === 'turtle'">
      <ellipse class="ink" cx="18" cy="52" rx="7" ry="6" fill="#7FB98F" />
      <ellipse class="ink" cx="62" cy="52" rx="7" ry="6" fill="#7FB98F" />
      <ellipse class="ink" cx="40" cy="44" rx="26" ry="21" fill="#3F8F5E" />
      <path d="M40 25 q17 5 17 19 q0 11 -17 14 q-17 -3 -17 -14 q0 -14 17 -19Z" fill="#57AE76" />
      <path class="ink" d="M40 28 L52 38 L47 52 L33 52 L28 38Z" fill="#2E7049" />
      <ellipse class="ink" cx="40" cy="63" rx="12" ry="9" fill="#8CC79E" />
      <circle cx="35" cy="62" r="2.4" fill="#1E3A28" />
      <circle cx="45" cy="62" r="2.4" fill="#1E3A28" />
    </g>

    <!-- paruparo / alibangbang / kulibangbang -->
    <g v-else-if="art === 'butterfly'">
      <path class="ink" d="M38 40 Q16 14 10 30 Q6 44 22 46 Q10 52 18 62 Q28 70 38 48Z" fill="#9B72E0" />
      <path class="ink" d="M42 40 Q64 14 70 30 Q74 44 58 46 Q70 52 62 62 Q52 70 42 48Z" fill="#FF8FB1" />
      <circle cx="22" cy="32" r="4" fill="#FFD98A" />
      <circle cx="58" cy="32" r="4" fill="#FFD98A" />
      <circle cx="25" cy="57" r="3" fill="#FFF4DC" />
      <circle cx="55" cy="57" r="3" fill="#FFF4DC" />
      <path class="ink" d="M40 22 q4 0 4 8 l0 24 q0 8 -4 8 q-4 0 -4 -8 l0 -24 q0 -8 4 -8Z" fill="#2A2140" />
      <path d="M37 22 q-6 -7 -10 -8 M43 22 q6 -7 10 -8" stroke="#2A2140" stroke-width="2.6" fill="none" stroke-linecap="round" />
      <circle cx="26" cy="13" r="2.8" fill="#2A2140" />
      <circle cx="54" cy="13" r="2.8" fill="#2A2140" />
    </g>

    <!-- fallback -->
    <g v-else>
      <circle class="ink" cx="40" cy="40" r="26" fill="#FFF4DC" />
      <text x="40" y="50" text-anchor="middle" font-size="28" font-family="Baloo 2, sans-serif" fill="#2A2140">?</text>
    </g>
  </svg>
</template>

<style scoped>
.art {
  display: block;
  overflow: visible;
}

.art :deep(.ink) {
  stroke: var(--linya);
  stroke-width: 2.6;
  stroke-linejoin: round;
  paint-order: stroke fill;
}
</style>
