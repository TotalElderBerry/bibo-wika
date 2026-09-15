<script setup lang="ts">
import { LANG_META, type Lang } from '~~/content/types'
import type { Compare, CompareForm, PackConcept } from '~/composables/usePack'

/**
 * Salita Sabayan - browse one concept across all four languages.
 *
 * Every general-purpose language app treats a language as an island. That
 * framing is wrong for the Philippines, where a child often has a Cebuano lola
 * and an Ilocano lolo. This screen is the whole argument for the product, so it
 * gets a permanent home rather than only appearing at the end of a lesson.
 */
const profile = useProfile()
const { say } = useAudio()

const concepts = ref<PackConcept[]>([])
const selected = ref<string | null>(null)
const detail = ref<Compare | null>(null)
const booting = ref(true)
const loadingDetail = ref(false)

onMounted(async () => {
  await profile.load()
  if (!profile.started) return navigateTo('/pumili')

  const pack = await fetchPack(profile.lang as Lang).catch(() => null)
  concepts.value = pack?.topics.flatMap((t) => t.concepts) ?? []
  booting.value = false

  // Open on the first word rather than an empty shell.
  if (concepts.value[0]) await pick(concepts.value[0].id)
})

async function pick(conceptId: string) {
  if (selected.value === conceptId) return
  selected.value = conceptId
  loadingDetail.value = true
  detail.value = await fetchCompare(conceptId).catch(() => null)
  loadingDetail.value = false
}

function play(f: CompareForm) {
  if (!detail.value) return
  say({ conceptId: detail.value.conceptId, lang: f.lang, text: f.text, status: f.status })
}

/** Play all four in sequence so the child hears the family of words together. */
async function playAll() {
  const d = detail.value
  if (!d) return
  for (const f of d.forms) {
    play(f)
    await new Promise((r) => setTimeout(r, 1100))
  }
}

const variants = computed(
  () => detail.value?.forms.filter((f) => f.variants.length) ?? [],
)

useHead({ title: 'Salita Sabayan' })
</script>

<template>
  <div class="screen">
    <header class="bar">
      <button class="back lift" aria-label="Bumalik" @click="navigateTo('/')">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            d="M15 5 L8 12 L15 19"
            fill="none"
            stroke="currentColor"
            stroke-width="3.4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div>
        <h1 class="heading">Salita Sabayan</h1>
        <p class="quiet">Isang salita, apat na wika</p>
      </div>
    </header>

    <div v-if="booting" class="grow center">
      <BuddyAvatar :name="profile.buddy ?? 'tikoy'" :size="100" />
    </div>

    <div v-else class="grow browse">
      <!-- picker -->
      <div class="rail">
        <button
          v-for="c in concepts"
          :key="c.id"
          class="chip lift"
          :class="{ on: selected === c.id }"
          @click="pick(c.id)"
        >
          <ConceptArt :art="c.art" :size="44" />
          <span class="chip-en">{{ c.en }}</span>
        </button>
      </div>

      <!-- detail -->
      <div v-if="detail" class="card chunk">
        <div class="card-head">
          <ConceptArt :art="detail.art" :size="66" />
          <div>
            <p class="say">Ingles</p>
            <p class="card-en">{{ detail.en }}</p>
          </div>
        </div>

        <div class="rows">
          <button
            v-for="f in detail.forms"
            :key="f.lang"
            class="row lift"
            :class="{ mine: f.lang === profile.lang }"
            @click="play(f)"
          >
            <span class="wika-chip" :class="`w-${f.lang}`">{{ f.lang }}</span>
            <span class="row-txt">
              <span class="row-word">{{ f.text }}</span>
              <span class="row-say">{{ f.respell }}</span>
            </span>
            <span class="row-play" aria-hidden="true">
              <svg viewBox="0 0 12 12" width="11" height="11">
                <path d="M2 1 L11 6 L2 11Z" fill="currentColor" />
              </svg>
            </span>
          </button>
        </div>

        <p v-if="variants.length" class="note">
          <strong>Sa ibang lugar:</strong>
          {{
            variants
              .map((f) => `${f.variants.join(', ')} (${LANG_META[f.lang].name})`)
              .join(' · ')
          }}
        </p>

        <BiboButton tone="ube" size="md" @click="playAll">Pakinggan lahat</BiboButton>
      </div>

      <div v-else-if="loadingDetail" class="card chunk center pad">
        <p class="quiet">Sandali lang…</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back {
  flex: none;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  color: var(--tinta);
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
  box-shadow: 0 4px 0 var(--lift);
}

.back:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pad {
  padding: 24px;
}

.browse {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

/* --------------------------------------------------------------- picker */
.rail {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.rail .chip {
  flex: none;
  width: 82px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 9px 4px 7px;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
  scroll-snap-align: start;
}

.rail .chip:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.rail .chip.on {
  background: var(--mangga);
}

.chip-en {
  font-family: var(--display);
  font-size: 12.5px;
  font-weight: 800;
}

/* --------------------------------------------------------------- detail */
.card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.card-en {
  font-family: var(--display);
  font-size: 30px;
  font-weight: 800;
  line-height: 1.1;
  text-transform: capitalize;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.row {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 60px;
  padding: 8px 12px;
  text-align: left;
  background: var(--papel-2);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
}

.row:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

/* The language the child is learning is marked, so the other three read as
   "and here is how your other lola says it". */
.row.mine {
  background: var(--papel);
  border-width: 4px;
}

.row-txt {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.row-word {
  font-family: var(--display);
  font-size: 23px;
  font-weight: 800;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

.row-say {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--tinta-2);
}

.row-play {
  margin-left: auto;
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2.5px solid var(--linya);
  background: var(--mangga);
  color: var(--tinta);
}

.note {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--tinta-2);
}

.note strong {
  color: var(--tinta);
}

/* ----------------------------------------------------------------- wide */
@media (min-width: 1024px) {
  .browse {
    display: grid;
    grid-template-columns: 150px 1fr;
    gap: 26px;
    align-items: start;
  }

  /* On a laptop the rail runs down the side instead of scrolling sideways. */
  .rail {
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;
    max-height: 62vh;
    padding-right: 6px;
    padding-bottom: 0;
  }

  .rail .chip {
    width: 100%;
    flex-direction: row;
    gap: 10px;
    justify-content: flex-start;
    padding: 8px 12px;
  }

  .card-en {
    font-size: 38px;
  }

  .row {
    min-height: 68px;
  }

  .row-word {
    font-size: 26px;
  }
}
</style>
