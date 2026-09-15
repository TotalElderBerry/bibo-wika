<script setup lang="ts">
import type { Lang } from '~~/content/types'
import { LANG_META } from '~~/content/types'
import type { Compare, CompareForm, Pack, PackConcept, PackTopic } from '~/composables/usePack'

/**
 * The lesson. Phase 0 ships two of the eleven exercise types from spec
 * section 06:
 *
 *   1. Pakinggan at Pindutin  - listen, then tap the picture (5 rounds)
 *   2. Tugma                  - match four sounds to four pictures
 *
 * Tugma is deliberately TAP-then-TAP rather than drag-and-drop. Dragging is
 * fiddly for four-year-old hands on a phone; two taps is not.
 *
 * Nothing here punishes. A wrong answer wobbles, the buddy looks thoughtful,
 * and the card stays available. There is no timer, no buzzer and no way to
 * lose. Spec section 02.
 */

type Step =
  | { kind: 'listen'; target: PackConcept; options: PackConcept[] }
  | { kind: 'match'; pairs: PackConcept[] }

const route = useRoute()
const profile = useProfile()
const { say, playing, usingPlaceholder } = useAudio()

const loading = ref(true)
const error = ref<string | null>(null)
const topic = ref<PackTopic | null>(null)
const source = ref<Pack['source']>('local-content')
const lang = ref<Lang>('tl')

const steps = ref<Step[]>([])
const i = ref(0)
const current = computed(() => steps.value[i.value] ?? null)

// listen state
const chosen = ref<string | null>(null)
const settled = ref(false)

// match state
const selWord = ref<string | null>(null)
const matched = ref<Set<string>>(new Set())
const missId = ref<string | null>(null)
/** Pictures in a different order from the words, fixed for the whole step. */
const pics = ref<PackConcept[]>([])

// scoring
const firstTry = ref(true)
const perfect = ref(0)
const mood = ref<'idle' | 'cheer' | 'think' | 'talk'>('idle')
const burst = ref(false)

const compare = ref<Compare | null>(null)
const done = computed(() => steps.value.length > 0 && i.value >= steps.value.length)

onMounted(async () => {
  await profile.load()
  if (!profile.started) return navigateTo('/pumili')
  lang.value = profile.lang!

  try {
    const pack = await fetchPack(lang.value)
    source.value = pack.source
    const t = pack.topics.find((x) => x.slug === route.params.topic)
    if (!t) throw new Error('Topic not found in this language pack')
    topic.value = t
    steps.value = build(t.concepts)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Could not load the lesson'
  } finally {
    loading.value = false
  }
})

function build(concepts: PackConcept[]): Step[] {
  const listen: Step[] = shuffle(concepts)
    .slice(0, 5)
    .map((target) => ({
      kind: 'listen' as const,
      target,
      options: shuffle([target, ...shuffle(concepts.filter((c) => c.id !== target.id)).slice(0, 3)]),
    }))
  return [...listen, { kind: 'match', pairs: shuffle(concepts).slice(0, 4) }]
}

function speak(c: PackConcept) {
  mood.value = 'talk'
  say({ conceptId: c.id, lang: lang.value, text: c.text, status: c.status })
  setTimeout(() => {
    if (mood.value === 'talk') mood.value = 'idle'
  }, 700)
}

/** Auto-play the prompt when a listen round begins. */
watch(
  current,
  (s) => {
    chosen.value = null
    settled.value = false
    selWord.value = null
    matched.value = new Set()
    firstTry.value = true
    pics.value = s?.kind === 'match' ? shuffle(s.pairs) : []
    if (s?.kind === 'listen') setTimeout(() => speak(s.target), 260)
  },
  { immediate: true },
)

function saySabayan(f: CompareForm) {
  if (!compare.value) return
  say({ conceptId: compare.value.conceptId, lang: f.lang, text: f.text, status: f.status })
}

/**
 * Keyboard play, for the desktop layout.
 *
 * Listen rounds: 1-4 answers, R or Space replays, Enter advances.
 * Tugma is modal - with no word chosen, 1-4 picks the word; once one is
 * chosen, 1-4 picks the picture. The on-screen hints move to whichever column
 * is live, so the mode is always visible rather than remembered.
 */
function onKey(e: KeyboardEvent) {
  if (loading.value || error.value) return
  const s = current.value

  if (e.key === 'Enter' && canAdvance.value) {
    e.preventDefault()
    next()
    return
  }
  if (!s) return

  if (e.key === 'Escape' && s.kind === 'match') {
    selWord.value = null
    return
  }

  if ((e.key === 'r' || e.key === 'R' || e.key === ' ') && s.kind === 'listen') {
    e.preventDefault()
    speak(s.target)
    return
  }

  const n = Number(e.key)
  if (!Number.isInteger(n) || n < 1 || n > 4) return

  if (s.kind === 'listen') {
    const opt = s.options[n - 1]
    if (opt && !settled.value) {
      e.preventDefault()
      tapOption(opt)
    }
  } else {
    e.preventDefault()
    if (selWord.value) {
      const pic = pics.value[n - 1]
      if (pic) tapPicture(pic)
    } else {
      const chip = s.pairs[n - 1]
      if (chip) tapWord(chip)
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

async function tapOption(c: PackConcept) {
  const s = current.value
  if (s?.kind !== 'listen' || settled.value) return

  chosen.value = c.id
  const right = c.id === s.target.id

  if (right) {
    settled.value = true
    mood.value = 'cheer'
    burst.value = true
    if (firstTry.value) perfect.value++
    await profile.record(s.target.id, lang.value, firstTry.value)
    await profile.award(firstTry.value ? 10 : 5)
    speak(s.target)
    setTimeout(() => (burst.value = false), 760)
  } else {
    firstTry.value = false
    mood.value = 'think'
    speak(c)
    setTimeout(() => {
      chosen.value = null
      mood.value = 'idle'
    }, 620)
  }
}

function tapWord(c: PackConcept) {
  if (matched.value.has(c.id)) return
  selWord.value = c.id
  speak(c)
}

async function tapPicture(c: PackConcept) {
  const s = current.value
  if (s?.kind !== 'match' || matched.value.has(c.id)) return

  if (!selWord.value) {
    // No sound picked yet - play this one so a tap is never a dead end.
    speak(c)
    return
  }

  if (selWord.value === c.id) {
    matched.value = new Set([...matched.value, c.id])
    selWord.value = null
    mood.value = 'cheer'
    burst.value = true
    await profile.record(c.id, lang.value, firstTry.value)
    setTimeout(() => {
      burst.value = false
      mood.value = 'idle'
    }, 700)
    if (matched.value.size === s.pairs.length) {
      if (firstTry.value) perfect.value++
      await profile.award(15)
    }
  } else {
    firstTry.value = false
    missId.value = c.id
    mood.value = 'think'
    setTimeout(() => {
      missId.value = null
      mood.value = 'idle'
    }, 560)
  }
}

const matchComplete = computed(() => {
  const s = current.value
  return s?.kind === 'match' && matched.value.size === s.pairs.length
})

const canAdvance = computed(() => settled.value || matchComplete.value)

async function next() {
  i.value++
  if (i.value >= steps.value.length && topic.value) {
    // End on Salita Sabayan: the same word the child just learned, in all four
    // languages. The point of the whole product, in one card.
    const pick = topic.value.concepts[Math.floor(Math.random() * topic.value.concepts.length)]!
    compare.value = await fetchCompare(pick.id).catch(() => null)
  }
}

const stars = computed(() => {
  const r = perfect.value / Math.max(1, steps.value.length)
  return r >= 0.85 ? 3 : r >= 0.5 ? 2 : 1
})

useHead({ title: () => topic.value?.title ?? 'Bibo Wika' })
</script>

<template>
  <div class="screen lesson">
    <!-- ---------------------------------------------------------------- head -->
    <header class="bar">
      <button class="exit" aria-label="Umalis" @click="navigateTo('/')">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" />
        </svg>
      </button>
      <ProgressPips :total="steps.length || 6" :done="Math.min(i, steps.length)" />
      <span class="wika-chip" :class="`w-${lang}`">{{ lang }}</span>
    </header>

    <!-- ------------------------------------------------------------- loading -->
    <div v-if="loading" class="grow center">
      <BuddyAvatar v-if="profile.buddy" :name="profile.buddy" :size="110" />
      <p class="quiet">Sandali lang…</p>
    </div>

    <div v-else-if="error" class="grow center">
      <div class="chunk pad">
        <h2 class="heading">Naku!</h2>
        <p class="quiet">{{ error }}</p>
      </div>
      <BiboButton tone="papel" size="md" @click="navigateTo('/')">Bumalik</BiboButton>
    </div>

    <!-- ---------------------------------------------------------------- done -->
    <div v-else-if="done" class="grow done">
      <div class="chunk pad center rise">
        <p class="stars">{{ '★'.repeat(stars) }}{{ '☆'.repeat(3 - stars) }}</p>
        <h2 class="heading">Magaling ka!</h2>
        <p class="quiet">+{{ profile.xp }} XP</p>
        <BuddyAvatar v-if="profile.buddy" :name="profile.buddy" :size="96" mood="cheer" />
      </div>

      <div v-if="compare" class="chunk pad sabayan rise">
        <div class="row">
          <ConceptArt :art="compare.art" :size="52" />
          <div>
            <p class="say">Salita Sabayan</p>
            <p class="heading">{{ compare.en }}</p>
          </div>
        </div>
        <button
          v-for="f in compare.forms"
          :key="f.lang"
          class="sab-row"
          @click="saySabayan(f)"
        >
          <span class="wika-chip" :class="`w-${f.lang}`">{{ f.lang }}</span>
          <span class="sab-word">{{ f.text }}</span>
          <span class="sab-say">{{ f.respell }}</span>
          <span class="sab-play" aria-hidden="true">
            <svg viewBox="0 0 12 12" width="11" height="11"><path d="M2 1 L11 6 L2 11Z" fill="currentColor" /></svg>
          </span>
        </button>
        <p v-if="compare.forms.some((f) => f.variants.length)" class="quiet small">
          Sa ibang lugar:
          {{
            compare.forms
              .filter((f) => f.variants.length)
              .map((f) => `${f.variants.join(', ')} (${LANG_META[f.lang].name})`)
              .join(' · ')
          }}
        </p>
      </div>

      <div class="stack">
        <BiboButton class="foot-btn" tone="mangga" @click="navigateTo('/')">Tapos na!</BiboButton>
      </div>
    </div>

    <!-- ------------------------------------------------------------- playing -->
    <template v-else-if="current">
      <div class="grow play">
        <!-- prompt -->
        <div class="prompt">
          <button
            class="buddy-btn"
            :aria-label="playing ? 'Nagsasalita' : 'Ulitin'"
            @click="current.kind === 'listen' && speak(current.target)"
          >
            <BuddyAvatar v-if="profile.buddy" :name="profile.buddy" :size="92" :mood="mood" />
            <span class="replay" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path d="M4 12 a8 8 0 1 1 3 6.2" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                <path d="M3 6 L4 12.5 L10 11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </button>

          <div v-if="current.kind === 'listen'" class="prompt-txt">
            <p class="word">{{ current.target.text }}</p>
            <p class="say">{{ current.target.respell }}</p>
          </div>
          <div v-else class="prompt-txt">
            <p class="heading">Tugma!</p>
            <p class="quiet">Pindutin ang salita, tapos ang larawan.</p>
          </div>
        </div>

        <!-- listen & tap -->
        <div v-if="current.kind === 'listen'" class="tapgrid">
          <StarBurst :show="burst" />
          <TapCard
            v-for="(o, n) in current.options"
            :key="o.id"
            :art="o.art"
            :word="o.text"
            :hint="n + 1"
            :frozen="settled"
            :state="
              settled && o.id === current.target.id
                ? 'correct'
                : chosen === o.id
                  ? 'wrong'
                  : 'idle'
            "
            @click="tapOption(o)"
          />
        </div>

        <!-- tugma -->
        <div v-else class="match">
          <StarBurst :show="burst" />
          <div class="col">
            <button
              v-for="(p, n) in current.pairs"
              :key="`w-${p.id}`"
              class="chip lift"
              :class="{ on: selWord === p.id, gone: matched.has(p.id) }"
              :disabled="matched.has(p.id)"
              @click="tapWord(p)"
            >
              <span v-if="!selWord && !matched.has(p.id)" class="key" aria-hidden="true">{{ n + 1 }}</span>
              <span class="spk" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path d="M4 9 h4 l5 -4 v14 l-5 -4 H4Z" fill="currentColor" />
                  <path d="M17 8.5 a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
                </svg>
              </span>
              <span class="chip-w">{{ p.text }}</span>
            </button>
          </div>
          <div class="col">
            <button
              v-for="(p, n) in pics"
              :key="`p-${p.id}`"
              class="pic-slot lift"
              :class="{ got: matched.has(p.id), miss: missId === p.id }"
              @click="tapPicture(p)"
            >
              <span v-if="selWord && !matched.has(p.id)" class="key slot-key" aria-hidden="true">{{ n + 1 }}</span>
              <ConceptArt :art="p.art" :size="54" />
            </button>
          </div>
        </div>
      </div>

      <!-- footer -->
      <div class="foot">
        <p v-if="usingPlaceholder" class="placeholder-warn">
          Placeholder speech — not a real {{ LANG_META[lang].name }} recording
        </p>
        <BiboButton
          class="foot-btn"
          :tone="canAdvance ? 'dahon' : 'papel'"
          :disabled="!canAdvance"
          @click="next"
        >
          {{ canAdvance ? 'Susunod!' : 'Pumili ka muna' }}
          <span v-if="canAdvance" class="key" aria-hidden="true">&crarr;</span>
        </BiboButton>
      </div>
    </template>

    <p v-if="source === 'local-content'" class="src-note">
      content: authored files (no database connected)
    </p>
  </div>
</template>

<style scoped>
.lesson {
  position: relative;
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.exit {
  width: 42px;
  height: 42px;
  flex: none;
  display: grid;
  place-items: center;
  color: var(--tinta);
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
  box-shadow: 0 4px 0 var(--lift);
}

.exit:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}

.pad {
  padding: 20px;
}

.play {
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: center;
}

/* ----------------------------------------------------------------- prompt */
.prompt {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--papel-2);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  padding: 12px 16px;
}

.buddy-btn {
  position: relative;
  flex: none;
  border-radius: 50%;
  touch-action: manipulation;
}

.buddy-btn:active {
  transform: scale(0.94);
}

.replay {
  position: absolute;
  right: -2px;
  bottom: 0;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  color: var(--tinta);
  background: var(--mangga);
  border: 2.5px solid var(--linya);
  border-radius: 50%;
}

.prompt-txt {
  min-width: 0;
}

/* ------------------------------------------------------------ listen & tap */
.tapgrid {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ----------------------------------------------------------------- tugma */
.match {
  position: relative;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  gap: 12px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 68px;
  padding: 8px 12px;
  text-align: left;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
  transition:
    transform 0.1s var(--ease),
    box-shadow 0.1s var(--ease),
    background-color 0.2s var(--ease),
    opacity 0.25s var(--ease);
}

.chip:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.chip.on {
  background: var(--ube);
  color: #fff;
}

.chip.gone {
  opacity: 0.3;
  box-shadow: none;
}

.spk {
  flex: none;
  display: grid;
  place-items: center;
}

.chip-w {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.pic-slot {
  display: grid;
  place-items: center;
  min-height: 68px;
  background: var(--papel);
  border: var(--edge) dashed var(--linya);
  border-radius: var(--round-sm);
  transition:
    background-color 0.2s var(--ease),
    border-style 0.2s var(--ease);
}

.pic-slot.got {
  background: var(--dahon);
  border-style: solid;
  box-shadow: 0 4px 0 var(--lift);
}

.pic-slot.miss {
  animation: bibo-wobble 0.5s var(--ease);
}

/* ------------------------------------------------------------------- done */
.done {
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
}

.stars {
  font-size: 38px;
  line-height: 1;
  color: var(--mangga);
  letter-spacing: 4px;
}

.sabayan {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sab-row {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 48px;
  padding: 6px 10px;
  text-align: left;
  background: var(--papel-2);
  border: 2.5px solid var(--linya);
  border-radius: var(--round-sm);
}

.sab-row:active {
  transform: translateY(2px);
}

.sab-word {
  font-family: var(--display);
  font-size: 19px;
  font-weight: 800;
}

.sab-say {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--tinta-2);
  text-transform: uppercase;
}

.sab-play {
  margin-left: auto;
  flex: none;
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2.5px solid var(--linya);
  background: var(--mangga);
  color: var(--tinta);
}

.small {
  font-size: 12.5px;
  line-height: 1.45;
}

/* ------------------------------------------------------------------- foot */
.foot {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.placeholder-warn {
  font-size: 12px;
  font-weight: 800;
  text-align: center;
  color: var(--tinta);
  background: var(--mangga);
  border: 2.5px solid var(--linya);
  border-radius: 999px;
  padding: 4px 12px;
}

.src-note {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--tinta-2);
  opacity: 0.7;
  pointer-events: none;
  margin-top: -8px;
}

.slot-key {
  position: absolute;
  top: 6px;
  left: 6px;
}

.pic-slot {
  position: relative;
}

/* =============================================================================
   wide screens
   -----------------------------------------------------------------------------
   The prompt stops being a banner above the answers and becomes a standing
   panel beside them, so the buddy stays at a readable size and the eye travels
   left-to-right instead of top-to-bottom past a lot of empty sky.
============================================================================= */

@media (min-width: 1024px) {
  .play {
    display: grid;
    grid-template-columns: minmax(280px, 360px) 1fr;
    gap: 36px;
    align-items: center;
  }

  .prompt {
    flex-direction: column;
    align-self: stretch;
    justify-content: center;
    text-align: center;
    gap: 18px;
    padding: 30px 24px;
  }

  .prompt-txt .word {
    font-size: 42px;
  }

  /* Target the buddy's own root svg, not every svg in the button - the replay
     badge is an svg too, and sizing it here bursts it out of its badge. */
  .buddy-btn :deep(.buddy) {
    width: 140px;
    height: 140px;
  }

  .tapgrid {
    gap: 18px;
  }

  .match {
    gap: 18px;
  }

  .col {
    gap: 14px;
  }

  .chip {
    min-height: 84px;
    padding: 10px 16px;
  }

  .chip-w {
    font-size: 22px;
  }

  .pic-slot {
    min-height: 84px;
  }

  .pic-slot :deep(svg) {
    width: 68px;
    height: 68px;
  }

  /* Two result cards sit side by side rather than stacking off-screen. */
  .done {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 22px;
    align-content: center;
    align-items: start;
  }

  .done > .stack {
    grid-column: 1 / -1;
  }

  .stars {
    font-size: 48px;
  }
}
</style>
