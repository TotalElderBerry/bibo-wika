<script setup lang="ts">
/**
 * Concept artwork. One drawing per CONCEPT, shared by all four languages -
 * which is the whole point of a concept-keyed content model: a dog is a dog
 * whether the child is being taught `aso`, `iro` or `ido`.
 *
 * Same sticker weight as the buddies so the two sit together on a card.
 *
 * Most keys are a literal drawing (`dog`, `rice`, `lola`). Two families are
 * drawn from the key instead, because hand-drawing them would be sixteen
 * near-identical copies of the same shape:
 *
 *   `color-*`  a paint swatch in that colour. Colours are the one topic where
 *              the picture IS the meaning - there is no drawing of "red",
 *              there is red - so a swatch is the honest illustration.
 *   `num-N`    N counting dots, laid out by `dots` below. The Usbong band
 *              counts objects; written numerals are a Puno reading exercise.
 */
const props = withDefaults(defineProps<{ art: string; size?: number }>(), { size: 72 })

/** Swatch fills. Deliberately the sticker palette, not pure CSS colours. */
const HUES: Record<string, string> = {
  red: '#E8442F',
  blue: '#2E86C8',
  yellow: '#FFC93C',
  green: '#3F8F5E',
  black: '#2A2140',
  white: '#FFFDF7',
  pink: '#FF8FB1',
  orange: '#FF8A3C',
}

const hue = computed(() =>
  props.art.startsWith('color-') ? HUES[props.art.slice(6)] ?? null : null,
)

const count = computed(() => {
  if (!props.art.startsWith('num-')) return 0
  const n = Number(props.art.slice(4))
  return Number.isInteger(n) && n >= 1 && n <= 12 ? n : 0
})

const DOT_HUES = ['#FF6B4A', '#FFB020', '#3FA9CC', '#57AE76', '#9B72E0', '#FF8FB1']

/**
 * Counting dots: one row up to three, otherwise two balanced rows. A child
 * counts a 4x2 block faster than a ragged line, and the dots stay inside the
 * 80x80 box at every count without a per-number drawing.
 */
const dots = computed(() => {
  const n = count.value
  if (!n) return []
  const perRow = n <= 3 ? n : Math.ceil(n / 2)
  const rows = Math.ceil(n / perRow)
  const r = perRow <= 2 ? 14 : perRow === 3 ? 11 : 8.5
  const gapX = 68 / perRow
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / perRow)
    const inRow = Math.min(perRow, n - row * perRow)
    const col = i - row * perRow
    return {
      x: 40 - ((inRow - 1) * gapX) / 2 + col * gapX,
      y: 40 - ((rows - 1) * 26) / 2 + row * 26,
      r,
      fill: DOT_HUES[i % DOT_HUES.length]!,
    }
  })
})
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 80 80" class="art" aria-hidden="true">
    <!-- ============================================ kulay - a paint swatch -->
    <g v-if="hue">
      <path
        class="ink"
        d="M16 28 Q18 13 34 14 Q48 15 60 19 Q70 23 68 35 Q66 48 61 57 Q56 67 41 67 Q24 67 17 56 Q10 45 16 28Z"
        :fill="hue"
      />
      <path
        d="M26 31 q8 -7 17 -4"
        stroke="#fff"
        stroke-width="3.6"
        fill="none"
        stroke-linecap="round"
        opacity=".5"
      />
    </g>

    <!-- ========================================= bilang - N counting dots -->
    <g v-else-if="count">
      <circle
        v-for="(d, n) in dots"
        :key="n"
        class="ink"
        :cx="d.x"
        :cy="d.y"
        :r="d.r"
        :fill="d.fill"
      />
    </g>

    <!-- ================================================= hayop - animals -->
    <!-- aso / iro / ido -->
    <g v-else-if="art === 'dog'">
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

    <!-- =================================================== pagkain - food -->

    <!-- kanin / kan-on / innapuy -->
    <g v-else-if="art === 'rice'">
      <path
        d="M30 25 q-5 -6 1 -11 M40 22 q-5 -7 1 -12 M50 25 q-5 -6 1 -11"
        stroke="#BEE7F4"
        stroke-width="2.8"
        fill="none"
        stroke-linecap="round"
      />
      <path class="ink" d="M17 42 Q40 22 63 42Z" fill="#FFF6E2" />
      <ellipse cx="33" cy="36" rx="3.4" ry="2.2" fill="#EFE3C4" />
      <ellipse cx="45" cy="34" rx="3.4" ry="2.2" fill="#EFE3C4" />
      <path class="ink" d="M13 42 L67 42 q-4 24 -27 24 q-23 0 -27 -24Z" fill="#3FA9CC" />
      <path d="M22 49 q18 8 36 0" stroke="#BEE7F4" stroke-width="3.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- tubig / danum -->
    <g v-else-if="art === 'water'">
      <path class="ink" d="M23 15 L57 15 L52 67 L28 67Z" fill="#EAF7FC" />
      <path d="M26 34 L54 34 L51.6 64 L28.4 64Z" fill="#3FA9CC" />
      <path d="M33 41 q0 9 3 15" stroke="#BEE7F4" stroke-width="3.2" fill="none" stroke-linecap="round" />
      <circle cx="46" cy="47" r="2.6" fill="#BEE7F4" />
      <ellipse class="ink" cx="40" cy="15" rx="17" ry="4" fill="#DFF3FB" />
    </g>

    <!-- saging / saba -->
    <g v-else-if="art === 'banana'">
      <path class="ink" d="M26 16 q1 30 20 39 q15 7 21 -2 q-15 3 -25 -8 q-11 -12 -10 -29Z" fill="#E8A81F" />
      <path class="ink" d="M19 19 q1 30 20 39 q15 7 21 -2 q-15 3 -25 -8 q-11 -12 -10 -29Z" fill="#FFC93C" />
      <path d="M22 24 q3 24 18 33" stroke="#FFE08A" stroke-width="2.6" fill="none" stroke-linecap="round" />
      <path class="ink" d="M14 12 q9 -3 11 5 q-8 4 -11 -5Z" fill="#7A6A3A" />
    </g>

    <!-- mangga -->
    <g v-else-if="art === 'mango'">
      <path class="ink" d="M40 20 Q63 20 65 42 Q67 66 40 68 Q13 66 15 42 Q17 20 40 20Z" fill="#FFC93C" />
      <path d="M27 33 q11 -8 23 -4" stroke="#FFE08A" stroke-width="3.6" fill="none" stroke-linecap="round" />
      <path d="M55 42 q3 15 -10 22" stroke="#FF8A3C" stroke-width="3" fill="none" stroke-linecap="round" opacity=".65" />
      <path class="ink" d="M43 13 q11 -5 17 2 q-11 6 -17 -2Z" fill="#57AE76" />
      <path d="M40 21 q1 -6 4 -8" stroke="#3F8F5E" stroke-width="3" fill="none" stroke-linecap="round" />
    </g>

    <!-- itlog -->
    <g v-else-if="art === 'egg'">
      <path
        class="ink"
        d="M24 27 Q38 15 54 22 Q70 29 64 43 Q60 54 47 55 Q43 65 31 62 Q19 58 21 46 Q14 34 24 27Z"
        fill="#FFF6E2"
      />
      <circle class="ink" cx="40" cy="40" r="13" fill="#FFB020" />
      <circle cx="35" cy="36" r="3.6" fill="#FFD98A" />
    </g>

    <!-- tinapay / pan -->
    <g v-else-if="art === 'bread'">
      <path class="ink" d="M15 42 Q15 24 40 24 Q65 24 65 42 L65 58 Q65 65 58 65 L22 65 Q15 65 15 58Z" fill="#E8A55C" />
      <path d="M21 42 Q21 31 40 31 Q59 31 59 42" stroke="#C98440" stroke-width="2.8" fill="none" />
      <path
        d="M30 30 q-2 8 0 13 M40 28 q-2 9 0 14 M50 30 q-2 8 0 13"
        stroke="#F6CB93"
        stroke-width="2.6"
        fill="none"
        stroke-linecap="round"
      />
      <ellipse cx="30" cy="54" rx="2.8" ry="2.2" fill="#C98440" />
      <ellipse cx="47" cy="57" rx="2.8" ry="2.2" fill="#C98440" />
    </g>

    <!-- niyog / lubi -->
    <g v-else-if="art === 'coconut'">
      <path class="ink" d="M40 22 q-15 -11 -25 -4 q13 0 21 8Z" fill="#3F8F5E" />
      <path class="ink" d="M40 22 q15 -11 25 -4 q-13 0 -21 8Z" fill="#57AE76" />
      <circle class="ink" cx="40" cy="45" r="24" fill="#8A6236" />
      <circle class="ink" cx="40" cy="45" r="17" fill="#FFF6E2" />
      <circle cx="40" cy="45" r="8" fill="#EFE3C4" />
      <path d="M23 34 q7 -7 15 -8" stroke="#A8794A" stroke-width="3" fill="none" stroke-linecap="round" />
    </g>

    <!-- sabaw / digo -->
    <g v-else-if="art === 'soup'">
      <path
        d="M29 22 q-5 -6 1 -11 M40 19 q-5 -7 1 -12 M51 22 q-5 -6 1 -11"
        stroke="#FFD98A"
        stroke-width="2.8"
        fill="none"
        stroke-linecap="round"
      />
      <path class="ink" d="M11 37 L69 37 q-5 27 -29 27 q-24 0 -29 -27Z" fill="#FFF6E2" />
      <path d="M17 41 L63 41 q-4 19 -23 19 q-19 0 -23 -19Z" fill="#FF8A3C" />
      <circle cx="31" cy="47" r="3.2" fill="#FFD98A" />
      <circle cx="45" cy="51" r="2.8" fill="#7FB98F" />
      <circle cx="49" cy="44" r="2.4" fill="#FFF6E2" />
    </g>

    <!-- ================================================ pamilya - family -->

    <!-- nanay / nanang / iloy -->
    <g v-else-if="art === 'mother'">
      <path class="ink" d="M24 30 q0 -18 16 -18 q16 0 16 18 l0 16 q0 8 -16 8 q-16 0 -16 -8Z" fill="#2A2140" />
      <circle class="ink" cx="40" cy="31" r="14" fill="#E0AC74" />
      <path class="ink" d="M26 29 q0 -17 14 -17 q14 0 14 17 q-5 -7 -14 -7 q-9 0 -14 7Z" fill="#2A2140" />
      <path class="ink" d="M40 45 q19 0 23 22 l-46 0 q4 -22 23 -22Z" fill="#FF8FB1" />
      <circle cx="35" cy="31" r="2.4" fill="#2A2140" />
      <circle cx="45" cy="31" r="2.4" fill="#2A2140" />
      <path d="M36 38 q4 4 8 0" stroke="#2A2140" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- tatay / tatang / amay -->
    <g v-else-if="art === 'father'">
      <circle class="ink" cx="40" cy="31" r="14" fill="#D9A268" />
      <path class="ink" d="M26 28 q0 -16 14 -16 q14 0 14 16 q-5 -7 -14 -7 q-9 0 -14 7Z" fill="#3A2A18" />
      <path class="ink" d="M40 45 q19 0 23 22 l-46 0 q4 -22 23 -22Z" fill="#3FA9CC" />
      <circle cx="35" cy="30" r="2.4" fill="#2A2140" />
      <circle cx="45" cy="30" r="2.4" fill="#2A2140" />
      <path d="M33 37 q7 3 14 0" stroke="#3A2A18" stroke-width="3.6" fill="none" stroke-linecap="round" />
      <path d="M36 42 q4 3 8 0" stroke="#2A2140" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- anak -->
    <g v-else-if="art === 'child'">
      <path d="M27 47 q-9 5 -9 14" stroke="#D9A268" stroke-width="6" fill="none" stroke-linecap="round" />
      <path d="M53 47 q9 5 9 14" stroke="#D9A268" stroke-width="6" fill="none" stroke-linecap="round" />
      <path class="ink" d="M40 42 q14 0 14 13 l0 8 q0 4 -14 4 q-14 0 -14 -4 l0 -8 q0 -13 14 -13Z" fill="#FF8A3C" />
      <circle class="ink" cx="40" cy="28" r="14" fill="#D9A268" />
      <path class="ink" d="M26 26 q0 -15 14 -15 q14 0 14 15 q-5 -7 -14 -7 q-9 0 -14 7Z" fill="#3A2A18" />
      <circle cx="35" cy="28" r="2.3" fill="#2A2140" />
      <circle cx="45" cy="28" r="2.3" fill="#2A2140" />
      <path d="M35 35 q5 5 10 0" stroke="#2A2140" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- sanggol / masuso / maladaga / lapsag -->
    <g v-else-if="art === 'baby'">
      <path class="ink" d="M40 30 q23 0 23 20 q0 18 -23 18 q-23 0 -23 -18 q0 -20 23 -20Z" fill="#BEE7F4" />
      <circle class="ink" cx="40" cy="30" r="15" fill="#E8C09A" />
      <path class="ink" d="M40 15 q7 -7 11 -1 q-6 1 -7 5 q-2 -4 -4 -4Z" fill="#3A2A18" />
      <circle cx="34" cy="30" r="2.3" fill="#2A2140" />
      <circle cx="46" cy="30" r="2.3" fill="#2A2140" />
      <path d="M36 37 q4 4 8 0" stroke="#2A2140" stroke-width="2.2" fill="none" stroke-linecap="round" />
      <circle cx="28" cy="35" r="3.2" fill="#FF8FB1" opacity=".55" />
      <circle cx="52" cy="35" r="3.2" fill="#FF8FB1" opacity=".55" />
    </g>

    <!-- kapatid / igsoon / kabsat / utod -->
    <g v-else-if="art === 'sibling'">
      <path class="ink" d="M27 42 q15 0 17 21 l-34 0 q2 -21 17 -21Z" fill="#3FA9CC" />
      <circle class="ink" cx="27" cy="30" r="12" fill="#D9A268" />
      <path class="ink" d="M15 28 q0 -13 12 -13 q12 0 12 13 q-4 -6 -12 -6 q-8 0 -12 6Z" fill="#3A2A18" />
      <circle cx="23" cy="30" r="2.1" fill="#2A2140" />
      <circle cx="31" cy="30" r="2.1" fill="#2A2140" />
      <path class="ink" d="M55 47 q15 0 17 18 l-34 0 q2 -18 17 -18Z" fill="#FF8FB1" />
      <circle class="ink" cx="55" cy="35" r="12" fill="#E0AC74" />
      <path class="ink" d="M43 33 q0 -13 12 -13 q12 0 12 13 l0 7 q-3 -11 -12 -11 q-9 0 -12 11Z" fill="#2A2140" />
      <circle cx="51" cy="35" r="2.1" fill="#2A2140" />
      <circle cx="59" cy="35" r="2.1" fill="#2A2140" />
    </g>

    <!-- ate / manang -->
    <g v-else-if="art === 'sister'">
      <circle class="ink" cx="59" cy="29" r="8" fill="#3A2A18" />
      <circle class="ink" cx="40" cy="32" r="13" fill="#E0AC74" />
      <path class="ink" d="M27 30 q0 -15 13 -15 q13 0 13 15 q-5 -6 -13 -6 q-8 0 -13 6Z" fill="#3A2A18" />
      <path class="ink" d="M40 45 q17 0 21 22 l-42 0 q4 -22 21 -22Z" fill="#FFC93C" />
      <circle cx="35" cy="32" r="2.3" fill="#2A2140" />
      <circle cx="45" cy="32" r="2.3" fill="#2A2140" />
      <path d="M36 39 q4 4 8 0" stroke="#2A2140" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- lola / apong baket -->
    <g v-else-if="art === 'grandmother'">
      <circle class="ink" cx="40" cy="15" r="8" fill="#F2F0EC" />
      <circle class="ink" cx="40" cy="33" r="14" fill="#E0AC74" />
      <path class="ink" d="M26 31 q0 -16 14 -16 q14 0 14 16 q-5 -7 -14 -7 q-9 0 -14 7Z" fill="#F2F0EC" />
      <path class="ink" d="M40 47 q19 0 23 20 l-46 0 q4 -20 23 -20Z" fill="#9B72E0" />
      <circle class="ink" cx="34" cy="33" r="5.4" fill="#FFFDF7" />
      <circle class="ink" cx="46" cy="33" r="5.4" fill="#FFFDF7" />
      <path d="M39.4 33 h1.2" stroke="#2A2140" stroke-width="2.2" />
      <circle cx="34" cy="33" r="2.1" fill="#2A2140" />
      <circle cx="46" cy="33" r="2.1" fill="#2A2140" />
      <path d="M36 42 q4 4 8 0" stroke="#2A2140" stroke-width="2.2" fill="none" stroke-linecap="round" />
    </g>

    <!-- lolo / apong lakay -->
    <g v-else-if="art === 'grandfather'">
      <circle class="ink" cx="40" cy="32" r="14" fill="#D9A268" />
      <path class="ink" d="M26 30 q0 -16 14 -16 q14 0 14 16 q-5 -7 -14 -7 q-9 0 -14 7Z" fill="#F2F0EC" />
      <path class="ink" d="M40 46 q19 0 23 21 l-46 0 q4 -21 23 -21Z" fill="#3F8F5E" />
      <circle class="ink" cx="34" cy="31" r="5.4" fill="#FFFDF7" />
      <circle class="ink" cx="46" cy="31" r="5.4" fill="#FFFDF7" />
      <path d="M39.4 31 h1.2" stroke="#2A2140" stroke-width="2.2" />
      <circle cx="34" cy="31" r="2.1" fill="#2A2140" />
      <circle cx="46" cy="31" r="2.1" fill="#2A2140" />
      <path class="ink" d="M31 38 q9 -4 18 0 q-4 6 -9 6 q-5 0 -9 -6Z" fill="#F2F0EC" />
    </g>

    <!-- ============================================== pagbati - greetings -->

    <!-- kumusta -->
    <g v-else-if="art === 'wave'">
      <path
        class="ink"
        d="M26 46 l0 -16 q0 -4 4 -4 q4 0 4 4 l0 9 l0 -18 q0 -4 4 -4 q4 0 4 4 l0 18 l0 -14 q0 -4 4 -4 q4 0 4 4 l0 14 l0 -8 q0 -4 4 -4 q4 0 4 4 l0 21 q0 15 -16 15 q-12 0 -16 -10 l-6 -12 q-2 -5 3 -7 q5 -2 7 3Z"
        fill="#E8C09A"
      />
      <path
        d="M60 20 q6 -3 11 1 M59 11 q10 -4 17 4"
        stroke="#FFB020"
        stroke-width="3.2"
        fill="none"
        stroke-linecap="round"
      />
    </g>

    <!-- magandang umaga / maayong buntag / naimbag a bigat -->
    <g v-else-if="art === 'sunrise'">
      <path
        d="M40 14 L40 5 M22 21 L16 15 M58 21 L64 15 M12 40 L4 40 M68 40 L76 40"
        stroke="#FFB020"
        stroke-width="3.4"
        stroke-linecap="round"
      />
      <circle class="ink" cx="40" cy="43" r="17" fill="#FFC93C" />
      <circle cx="34" cy="41" r="2.6" fill="#2A2140" />
      <circle cx="46" cy="41" r="2.6" fill="#2A2140" />
      <path d="M34 49 q6 5 12 0" stroke="#2A2140" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <rect class="ink" x="7" y="60" width="66" height="9" rx="4.5" fill="#57AE76" />
    </g>

    <!-- magandang hapon / maayong hapon / naimbag a malem -->
    <g v-else-if="art === 'sun-high'">
      <path
        d="M40 12 L40 4 M23 18 L17 12 M57 18 L63 12 M17 33 L8 33 M63 33 L72 33"
        stroke="#FF8A3C"
        stroke-width="3.4"
        stroke-linecap="round"
      />
      <circle class="ink" cx="40" cy="33" r="16" fill="#FF8A3C" />
      <circle cx="34" cy="31" r="2.4" fill="#2A2140" />
      <circle cx="46" cy="31" r="2.4" fill="#2A2140" />
      <path d="M34 39 q6 4 12 0" stroke="#2A2140" stroke-width="2.4" fill="none" stroke-linecap="round" />
      <path
        class="ink"
        d="M28 64 q0 -9 9 -8 q3 -7 10 -7 q8 0 10 8 q9 -1 9 7 q0 6 -9 6 l-20 0 q-9 0 -9 -6Z"
        fill="#FFF6E2"
      />
    </g>

    <!-- magandang gabi / maayong gabii / naimbag a rabii -->
    <g v-else-if="art === 'moon'">
      <path
        class="ink"
        d="M50 12 C22 14 11 26 11 40 C11 54 22 66 50 68 C31 60 27 52 27 40 C27 28 31 20 50 12Z"
        fill="#FFE08A"
      />
      <path class="ink" d="M63 17 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3Z" fill="#FFC93C" />
      <circle cx="59" cy="47" r="3.2" fill="#FFC93C" />
      <circle cx="69" cy="57" r="2.4" fill="#FFE08A" />
    </g>

    <!-- salamat / agyamanak. Pressed palms were tried first and read as
         rabbit ears at 72px; a warm thing being SAID survives the size. -->
    <g v-else-if="art === 'thanks'">
      <path
        class="ink"
        d="M16 16 L64 16 q9 0 9 9 l0 21 q0 9 -9 9 l-17 0 l-13 12 l1 -12 l-19 0 q-9 0 -9 -9 l0 -21 q0 -9 9 -9Z"
        fill="#FFF6E2"
      />
      <path class="ink" d="M40 28 q-5 -8 -11 -2 q-7 6 0 13 q5 5 11 8 q6 -3 11 -8 q7 -7 0 -13 q-6 -6 -11 2Z" fill="#FF6B4A" />
    </g>

    <!-- oo / wen / huo -->
    <g v-else-if="art === 'yes'">
      <circle class="ink" cx="40" cy="40" r="26" fill="#57AE76" />
      <path
        d="M27 41 l9 10 l17 -21"
        stroke="#FFF6E2"
        stroke-width="7"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>

    <!-- hindi / dili / saan / indi. A bar, not a cross: nothing in this app
         marks a child wrong, and a red X reads as exactly that. -->
    <g v-else-if="art === 'no'">
      <circle class="ink" cx="40" cy="40" r="26" fill="#FF8A3C" />
      <rect x="24" y="36" width="32" height="8" rx="4" fill="#FFF6E2" />
    </g>

    <!-- walang anuman / walay sapayan / awan ti anyaman. Open palms and a
         small puff: "it is nothing". Deliberately NOT a second heart - the
         heart belongs to salamat, and two hearts in one Tugma round would be
         four pictures with two of them alike. -->
    <g v-else-if="art === 'welcome'">
      <path class="ink" d="M9 41 q7 -9 15 -4 l16 8 l16 -8 q8 -5 15 4 q-9 20 -31 20 q-22 0 -31 -20Z" fill="#E8C09A" />
      <path d="M40 45 L40 61" stroke="#B98A55" stroke-width="2.2" stroke-linecap="round" />
      <path
        d="M27 25 q4 -7 11 -5 M53 25 q-4 -7 -11 -5 M40 17 L40 9"
        stroke="#FFB020"
        stroke-width="3.2"
        fill="none"
        stroke-linecap="round"
      />
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
