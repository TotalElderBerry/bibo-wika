<script setup lang="ts">
import { LANGS, LANG_META, type Lang } from '~~/content/types'

/**
 * Language picker. The guide's name is shown rather than a flag or a speaker
 * count - a child picks the friend, not the demographic.
 *
 * Spec section 15 flags a real open question here: a flat list may push most
 * learners to Tagalog and strand the other three. Language choice is
 * instrumented from day one so the beta can answer it.
 */
const profile = useProfile()
const picked = ref<Lang | null>(null)

onMounted(async () => {
  await profile.load()
  picked.value = profile.lang ?? 'tl'
})

async function confirm() {
  if (!picked.value) return
  await profile.pickLang(picked.value)
  // The hub, not a lesson. With one topic authored this jumped straight into
  // it; with six, dropping a child into Hayop every time hides the other five.
  await navigateTo('/laro')
}

useHead({ title: 'Anong wika?' })
</script>

<template>
  <div class="screen">
    <header class="head row">
      <BuddyAvatar v-if="profile.buddy" :name="profile.buddy" :size="54" />
      <div>
        <h1 class="heading">Anong wika?</h1>
        <p class="quiet">Ano ang sinasalita ni lola?</p>
      </div>
    </header>

    <div class="grow stack">
      <button
        v-for="l in LANGS"
        :key="l"
        class="wika lift"
        :class="[`k-${l}`, { on: picked === l }]"
        :aria-pressed="picked === l"
        @click="picked = l"
      >
        <span class="dot" />
        <span class="txt">
          <span class="nm">{{ LANG_META[l].name }}</span>
          <span class="endo">{{ LANG_META[l].endonym }}</span>
        </span>
        <span class="guide">
          <span class="guide-nm">{{ LANG_META[l].guide }}</span>
          <span class="guide-lbl">gabay</span>
        </span>
      </button>
    </div>

    <BiboButton class="foot-btn" tone="dahon" :disabled="!picked" @click="confirm">
      Tara na!
    </BiboButton>
  </div>
</template>

<style scoped>
.head {
  gap: 14px;
}

.wika {
  --k: var(--tl);
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 86px;
  padding: 12px 16px;
  text-align: left;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  box-shadow: 0 var(--drop) 0 var(--lift);
  transition:
    transform 0.1s var(--ease),
    box-shadow 0.1s var(--ease),
    background-color 0.2s var(--ease);
  touch-action: manipulation;
}

.wika:active {
  transform: translateY(var(--drop));
  box-shadow: 0 0 0 var(--lift);
}

.k-tl { --k: var(--tl); }
.k-ceb { --k: var(--ceb); }
.k-ilo { --k: var(--ilo); }
.k-hil { --k: var(--hil); }

.wika.on {
  background: var(--k);
}

.dot {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  border: var(--edge) solid var(--linya);
  background: var(--k);
}

.wika.on .dot {
  background: var(--papel);
}

.txt {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nm {
  font-family: var(--display);
  font-size: 22px;
  font-weight: 800;
  line-height: 1.15;
}

.endo {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--tinta-2);
}

.wika.on .nm,
.wika.on .endo,
.wika.on .guide-nm,
.wika.on .guide-lbl {
  color: #fff;
}

.guide {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex: none;
}

.guide-nm {
  font-family: var(--display);
  font-size: 16px;
  font-weight: 800;
}

.guide-lbl {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tinta-2);
}

/* Four in a column is a phone list; four in a square is a wall of choices,
   which is what picking a language actually is. */
@media (min-width: 1024px) {
  .grow {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-content: center;
  }

  .wika {
    min-height: 116px;
    padding: 16px 22px;
    gap: 18px;
  }

  .dot {
    width: 40px;
    height: 40px;
  }

  .nm {
    font-size: 27px;
  }

  .endo {
    font-size: 14px;
  }

  .guide-nm {
    font-size: 19px;
  }
}
</style>
