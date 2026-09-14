<script setup lang="ts">
import { BUDDIES, type BuddyName } from '~/utils/buddies'

/**
 * First screen after the splash. The buddy is chosen BEFORE the language -
 * attachment first, curriculum second. Spec section 07.
 */
const profile = useProfile()
const picked = ref<BuddyName | null>(null)

onMounted(async () => {
  await profile.load()
  picked.value = profile.buddy ?? 'tikoy'
})

async function confirm() {
  if (!picked.value) return
  await profile.pickBuddy(picked.value)
  await navigateTo('/wika')
}

useHead({ title: 'Pumili ng kaibigan' })
</script>

<template>
  <div class="screen">
    <header class="head">
      <h1 class="heading">Sino ang kasama mo?</h1>
      <p class="quiet">Pwede mong palitan mamaya.</p>
    </header>

    <div class="grow">
      <div class="pen">
        <BuddyAvatar v-if="picked" :name="picked" :size="132" :mood="'idle'" />
        <p v-if="picked" class="pen-name">{{ buddyLabel(picked) }}</p>
      </div>

      <div class="grid">
        <button
          v-for="b in BUDDIES"
          :key="b.id"
          class="pick lift"
          :class="{ on: picked === b.id }"
          :aria-pressed="picked === b.id"
          @click="picked = b.id"
        >
          <BuddyAvatar :name="b.id" :size="62" :mood="picked === b.id ? 'cheer' : 'idle'" />
          <span class="nm">{{ b.label }}</span>
          <span class="sp">{{ b.species }}</span>
        </button>
      </div>
    </div>

    <BiboButton class="foot-btn" tone="dahon" :disabled="!picked" @click="confirm">
      Siya na!
    </BiboButton>
  </div>
</template>

<style scoped>
.head {
  text-align: center;
}

.pen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: var(--papel-2);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  padding: 14px;
  margin-bottom: 16px;
}

.pen-name {
  font-family: var(--display);
  font-size: 24px;
  font-weight: 800;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.pick {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-height: 112px;
  padding: 10px 4px 8px;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
  box-shadow: 0 4px 0 var(--lift);
  transition:
    transform 0.1s var(--ease),
    box-shadow 0.1s var(--ease),
    background-color 0.2s var(--ease);
  touch-action: manipulation;
}

.pick:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.pick.on {
  background: var(--mangga);
}

.nm {
  font-family: var(--display);
  font-size: 15px;
  font-weight: 800;
}

.sp {
  font-size: 11px;
  font-weight: 700;
  color: var(--tinta-2);
  line-height: 1.2;
}

.pick.on .sp {
  color: var(--tinta);
}

@media (max-width: 360px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Wide: the chosen buddy stands in their own pen on the left, at a size worth
   looking at, with the roster beside them instead of underneath. */
@media (min-width: 1024px) {
  .grow {
    display: grid;
    grid-template-columns: minmax(260px, 340px) 1fr;
    gap: 34px;
    align-items: center;
  }

  .pen {
    margin-bottom: 0;
    align-self: stretch;
    justify-content: center;
    padding: 28px 20px;
    gap: 10px;
  }

  .pen :deep(svg) {
    width: 190px;
    height: 190px;
  }

  .pen-name {
    font-size: 32px;
  }

  .grid {
    gap: 16px;
  }

  .pick {
    min-height: 152px;
    padding: 16px 8px 12px;
    gap: 4px;
  }

  .pick :deep(svg) {
    width: 84px;
    height: 84px;
  }

  .nm {
    font-size: 18px;
  }

  .sp {
    font-size: 13px;
  }
}
</style>
