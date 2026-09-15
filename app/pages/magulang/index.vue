<script setup lang="ts">
const auth = useAuth()
const profile = useProfile()

interface ProfileSummary {
  id: string
  displayName: string
  band: 'usbong' | 'puno'
  avatar: Record<string, string>
  activeLang: string
  xp: number
  stats: {
    practiced: number
    mastered: number
    due: number
  }
}

interface ProfilesResponse {
  profiles: ProfileSummary[]
}

const { data, pending, error: loadError, refresh } = await useFetch<ProfilesResponse>(
  '/api/parent/profiles',
)
const linking = ref(false)
const linkError = ref('')
const linked = ref(false)

const profiles = computed(() => data.value?.profiles ?? [])

async function linkCurrentProfile() {
  if (linking.value) return
  linking.value = true
  linkError.value = ''

  try {
    await profile.load()
    if (!profile.started || !profile.id || !profile.buddy || !profile.lang) {
      throw new Error('Start a child profile on this device before linking it.')
    }

    await $fetch('/api/parent/profiles/link', {
      method: 'POST',
      body: {
        id: profile.id,
        displayName: profile.buddy,
        buddy: profile.buddy,
        lang: profile.lang,
        band: profile.band,
        xp: profile.xp,
        boxes: profile.boxes,
      },
    })
    linked.value = true
    await refresh()
  } catch (err) {
    linkError.value = err instanceof Error ? err.message : 'Could not link this profile.'
  } finally {
    linking.value = false
  }
}

useHead({ title: 'Magulang - Bibo Wika' })
</script>

<template>
  <div class="screen parent-home">
    <header class="top">
      <NuxtLink to="/" class="brand lift">Bibo Wika</NuxtLink>
      <button class="logout lift" @click="auth.logout">Lumabas</button>
    </header>

    <main class="grow dash">
      <section class="hello chunk">
        <p class="say">Parent dashboard</p>
        <h1 class="heading">Kumusta, {{ auth.parent?.displayName }}.</h1>
        <p class="quiet">
          Tingnan ang progreso ng mga batang naka-link sa account na ito. Ang mga bata ay hindi
          kailangang mag-log in para maglaro.
        </p>
      </section>

      <p v-if="loadError" class="error" role="alert">
        Could not load linked profiles. Please refresh and try again.
      </p>

      <section v-else-if="pending" class="chunk state">
        Loading family profiles...
      </section>

      <section v-else-if="profiles.length" class="profiles">
        <article v-for="child in profiles" :key="child.id" class="chunk child-card">
          <div class="child-head">
            <div class="child-avatar" aria-hidden="true">{{ child.avatar.buddy }}</div>
            <div>
              <p class="say">Child profile</p>
              <h2 class="child-name">{{ child.displayName }}</h2>
            </div>
          </div>

          <div class="grid">
            <div class="tile">
              <span class="tile-n">{{ child.xp }}</span>
              <span class="tile-l">XP</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ child.stats.practiced }}</span>
              <span class="tile-l">Words practiced</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ child.stats.mastered }}</span>
              <span class="tile-l">Mastered</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ child.stats.due }}</span>
              <span class="tile-l">Ready to review</span>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="chunk empty">
        <p class="say">No linked profiles yet</p>
        <h2 class="child-name">Bring this device's progress here.</h2>
        <p class="quiet">
          Start a child profile in the play app, then link it here. The child keeps playing locally;
          this account only adds backup and parent visibility.
        </p>
        <p v-if="linked" class="success" role="status">Profile linked. Progress will appear here.</p>
        <p v-if="linkError" class="error" role="alert">{{ linkError }}</p>
        <button class="play lift" :disabled="linking" @click="linkCurrentProfile">
          {{ linking ? 'Linking...' : 'Link this device profile' }}
        </button>
        <NuxtLink to="/laro" class="child-link">Open child app</NuxtLink>
      </section>

      <NuxtLink v-if="profiles.length" to="/laro" class="play lift">Open child app</NuxtLink>
    </main>
  </div>
</template>

<style scoped>
.parent-home {
  max-width: 760px;
}

.top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand,
.logout,
.play {
  color: var(--linya);
  text-decoration: none;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--lift);
  padding: 8px 16px;
  font-family: var(--display);
  font-weight: 800;
}

.logout {
  margin-left: auto;
}

.brand:active,
.logout:active,
.play:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.dash {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.hello {
  padding: 22px;
  background: var(--papel-2);
}

.hello .quiet {
  margin-top: 10px;
  max-width: 56ch;
}

.profiles {
  display: grid;
  gap: 16px;
}

.child-card,
.empty,
.state {
  padding: 20px;
  background: var(--papel-2);
}

.child-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.child-avatar {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
  background: var(--mangga);
  font-family: var(--display);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.child-name {
  margin-top: 4px;
  font-family: var(--display);
  font-size: 25px;
  line-height: 1.05;
}

.empty .quiet {
  margin: 10px 0 16px;
  max-width: 54ch;
}

.state {
  color: var(--tinta-2);
}

.success {
  margin-bottom: 12px;
  color: var(--dahon);
  font-weight: 800;
}

.child-link {
  display: inline-block;
  margin-left: 12px;
  color: var(--linya);
  font-weight: 800;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px;
}

.tile-n {
  font-family: var(--display);
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}

.tile-l {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--tinta-2);
}

.play {
  display: inline-flex;
  align-self: flex-start;
  justify-content: center;
  background: var(--mangga);
  min-height: 54px;
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .play {
    width: 100%;
  }
}
</style>
