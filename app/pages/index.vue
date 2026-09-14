<script setup lang="ts">
import { LANG_META } from '~~/content/types'
import { upcoming } from '~~/content/roadmap'
import type { Pack } from '~/composables/usePack'

/**
 * Home.
 *
 * Two states of one page:
 *   - First run: a welcome, and one button. Nothing to decide yet.
 *   - Returning: the hub described in spec section 07 - who you are, what to
 *     continue, and the topic map.
 *
 * The topic map is a plain vertical list, not a winding island path. A winding
 * map looks charming in a screenshot and is miserable on a 5-inch phone held by
 * a seven-year-old: targets end up small, off-axis and hard to hit.
 */
const profile = useProfile()
const ground = useGround()

const pack = ref<Pack | null>(null)
const booting = ref(true)

onMounted(async () => {
  await profile.load()
  if (profile.lang) pack.value = await fetchPack(profile.lang).catch(() => null)
  booting.value = false
})

const topic = computed(() => pack.value?.topics[0] ?? null)

/** Mastery is per concept PER LANGUAGE, so these counts are for the active wika. */
const stats = computed(() => {
  const lang = profile.lang
  if (!lang) return { started: 0, mastered: 0 }
  const mine = Object.entries(profile.boxes).filter(([k]) => k.endsWith(`:${lang}`))
  return {
    started: mine.length,
    mastered: mine.filter(([, box]) => box >= 4).length,
  }
})

const progress = computed(() => {
  const t = topic.value
  const lang = profile.lang
  if (!t || !lang) return { done: 0, total: 0, pct: 0 }
  const done = t.concepts.filter((c) => (profile.boxes[`${c.id}:${lang}`] ?? 0) > 0).length
  return { done, total: t.concepts.length, pct: t.concepts.length ? done / t.concepts.length : 0 }
})

const topicStars = computed(() => {
  const p = progress.value
  if (!p.total) return 0
  return p.pct >= 1 ? 3 : p.pct >= 0.6 ? 2 : p.pct > 0 ? 1 : 0
})

useHead({ title: 'Bibo Wika' })
</script>

<template>
  <div class="screen home">
    <!-- ==================================== first run (and the prerendered
         shell - `/` is a static file, so this is what a cold visitor and a
         link preview both get, rather than a spinner) -->
    <template v-if="booting || !profile.started">
      <button class="ground-toggle" :aria-label="ground.label.value" @click="ground.toggle">
        {{ ground.icon.value }}
      </button>

      <div class="grow hero">
        <div class="logo rise">
          <h1 class="title">Bibo<br />Wika</h1>
          <p class="tagline">Mag-aral tayo ng wika!</p>
        </div>
        <div class="crowd">
          <BuddyAvatar name="tikoy" :size="104" class="b1" />
          <BuddyAvatar name="sari" :size="88" class="b2" />
          <BuddyAvatar name="pawi" :size="80" class="b3" />
        </div>
      </div>

      <BiboButton class="foot-btn" tone="mangga" @click="navigateTo('/pumili')">
        Magsimula
      </BiboButton>
    </template>

    <!-- =============================================================== hub -->
    <template v-else>
      <header class="bar">
        <button class="me" @click="navigateTo('/pumili')">
          <BuddyAvatar :name="profile.buddy!" :size="54" />
          <span class="me-txt">
            <span class="me-hi">Kumusta!</span>
            <span class="me-sub">{{ buddyLabel(profile.buddy!) }}</span>
          </span>
        </button>
        <button class="wika-chip lift" :class="`w-${profile.lang}`" @click="navigateTo('/wika')">
          {{ LANG_META[profile.lang!].name }}
        </button>
        <button class="ground-btn" :aria-label="ground.label.value" @click="ground.toggle">
          {{ ground.icon.value }}
        </button>
      </header>

      <div class="hub">
        <section class="panel">
          <div class="tiles">
            <div class="tile">
              <span class="tile-n">{{ profile.xp }}</span>
              <span class="tile-l">XP</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ stats.started }}</span>
              <span class="tile-l">Salita</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ stats.mastered }}</span>
              <span class="tile-l">Kabisado</span>
            </div>
          </div>

          <div v-if="topic" class="cont chunk">
            <p class="say">{{ progress.done ? 'Magpatuloy' : 'Simulan' }}</p>
            <h2 class="heading">{{ topic.title }}</h2>
            <div class="cont-row">
              <ProgressPips :total="progress.total" :done="progress.done" />
              <span class="cont-count">{{ progress.done }}/{{ progress.total }}</span>
            </div>
            <BiboButton tone="dahon" @click="navigateTo(`/laro/${topic.slug}`)">
              Maglaro
            </BiboButton>
          </div>
        </section>

        <section class="panel">
          <h3 class="sec">Mga Aralin</h3>
          <div class="list">
            <button
              v-if="topic"
              class="topic lift"
              @click="navigateTo(`/laro/${topic.slug}`)"
            >
              <span class="topic-art"><AnimalArt :art="topic.art" :size="42" /></span>
              <span class="topic-txt">
                <span class="topic-nm">{{ topic.title }}</span>
                <span class="topic-sub">{{ progress.done }} / {{ progress.total }} salita</span>
              </span>
              <span class="topic-stars">{{ '★'.repeat(topicStars) }}{{ '☆'.repeat(3 - topicStars) }}</span>
            </button>

            <div v-for="u in upcoming" :key="u.slug" class="topic locked">
              <span class="topic-art">
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="3" fill="currentColor" />
                  <path
                    d="M8 10 V7 a4 4 0 0 1 8 0 v3"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <span class="topic-txt">
                <span class="topic-nm">{{ u.title[profile.lang!] }}</span>
                <span class="topic-sub">Malapit na</span>
              </span>
            </div>
          </div>

          <button class="sabayan lift" @click="navigateTo('/salita')">
            <span class="sab-keys">
              <span class="k w-tl">TL</span><span class="k w-ceb">CEB</span>
              <span class="k w-ilo">ILO</span><span class="k w-hil">HIL</span>
            </span>
            <span class="sab-txt">
              <span class="sab-nm">Salita Sabayan</span>
              <span class="sab-sub">Isang salita, apat na wika</span>
            </span>
            <span class="sab-go" aria-hidden="true">›</span>
          </button>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.home {
  position: relative;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ------------------------------------------------------------- first run */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
}

.logo {
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  box-shadow: 0 var(--drop) 0 var(--lift);
  padding: 22px 32px;
  text-align: center;
  transform: rotate(-2.5deg);
}

.title {
  font-size: clamp(46px, 15vw, 72px);
  color: var(--sili);
  -webkit-text-stroke: 2px var(--linya);
  paint-order: stroke fill;
}

.tagline {
  font-family: var(--display);
  font-size: 17px;
  font-weight: 700;
  color: var(--tinta-2);
  margin-top: 6px;
}

.crowd {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
}

.b1 { z-index: 3; }
.b2 { margin-left: -14px; animation-delay: 0.4s; z-index: 2; }
.b3 { margin-left: -12px; animation-delay: 0.8s; z-index: 1; }

.ground-toggle {
  position: absolute;
  top: max(14px, env(safe-area-inset-top));
  right: 16px;
  width: 48px;
  height: 48px;
  font-size: 22px;
  line-height: 1;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
  box-shadow: 0 4px 0 var(--lift);
  z-index: 10;
}

.ground-toggle:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

/* ------------------------------------------------------------------- hub */
.bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.me {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 5px;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--lift);
  text-align: left;
  min-width: 0;
}

.me:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.me-txt {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.me-hi {
  font-family: var(--display);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.1;
}

.me-sub {
  font-size: 12px;
  font-weight: 700;
  color: var(--tinta-2);
}

.bar .wika-chip {
  margin-left: auto;
  box-shadow: 0 4px 0 var(--lift);
  padding: 7px 14px;
  font-size: 14px;
}

.bar .wika-chip:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.ground-btn {
  flex: none;
  width: 44px;
  height: 44px;
  font-size: 19px;
  line-height: 1;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
  box-shadow: 0 4px 0 var(--lift);
}

.ground-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

/* No inner scroller - the document scrolls. A nested scroll area here means
   the header scrolls away AND the list scrolls, which is two scrollbars
   fighting over one gesture. */
.hub {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* stat tiles */
.tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 6px 8px;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
}

.tile-n {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.tile-l {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--tinta-2);
  margin-top: 3px;
}

/* continue card */
.cont {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--papel-2);
}

.cont-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cont-count {
  font-family: var(--display);
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  flex: none;
}

/* topic list */
.sec {
  font-family: var(--display);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--tinta-2);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.topic {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 66px;
  padding: 8px 14px;
  text-align: left;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
}

.topic:active:not(.locked) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.topic.locked {
  opacity: 0.5;
  box-shadow: none;
  border-style: dashed;
  color: var(--tinta-2);
}

.topic-art {
  flex: none;
  display: grid;
  place-items: center;
  width: 46px;
}

.topic-txt {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topic-nm {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.15;
}

.topic-sub {
  font-size: 12px;
  font-weight: 700;
  color: var(--tinta-2);
}

.topic-stars {
  margin-left: auto;
  flex: none;
  font-size: 14px;
  letter-spacing: 1px;
  color: var(--mangga);
}

/* salita sabayan */
.sabayan {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 70px;
  padding: 10px 14px;
  text-align: left;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
  margin-top: 4px;
}

.sabayan:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.sab-keys {
  flex: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}

.sab-keys .k {
  font-family: var(--display);
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1.5px solid var(--linya);
  text-align: center;
}

.sab-txt {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sab-nm {
  font-family: var(--display);
  font-size: 17px;
  font-weight: 800;
  line-height: 1.15;
}

.sab-sub {
  font-size: 12px;
  font-weight: 700;
  color: var(--tinta-2);
}

.sab-go {
  margin-left: auto;
  font-family: var(--display);
  font-size: 26px;
  font-weight: 800;
  color: var(--tinta-2);
  line-height: 1;
}

/* ----------------------------------------------------------------- wide */
@media (min-width: 1024px) {
  .hero {
    flex-direction: row;
    gap: 64px;
    justify-content: center;
  }

  .logo {
    padding: 34px 46px;
  }

  .title {
    font-size: 88px;
  }

  .tagline {
    font-size: 21px;
  }

  .crowd :deep(.buddy) {
    width: 150px;
    height: 150px;
  }

  .b2,
  .b3 {
    width: 124px;
    height: 124px;
  }

  /* The hub becomes two columns: identity and progress on the left, the map
     on the right - so nothing important sits below the fold. */
  .hub {
    display: grid;
    grid-template-columns: minmax(300px, 400px) 1fr;
    gap: 30px;
    align-items: start;
  }

  .tile-n {
    font-size: 32px;
  }

  .cont {
    padding: 20px 22px;
  }

  .topic {
    min-height: 78px;
  }

  .topic-nm {
    font-size: 20px;
  }
}
</style>
