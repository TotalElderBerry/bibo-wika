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

const LANGUAGE_LABELS: Record<string, string> = {
  tl: 'Tagalog',
  ceb: 'Cebuano',
  ilo: 'Ilocano',
  hil: 'Hiligaynon',
}

const { data, pending, error: loadError, refresh } = await useFetch<ProfilesResponse>(
  '/api/parent/profiles',
)
const linking = ref(false)
const linkError = ref('')
const linked = ref(false)
const formOpen = ref(false)
const saving = ref(false)
const deletingId = ref('')
const activatingId = ref('')
const selectedId = ref('')
const formError = ref('')
const activationError = ref('')
const form = reactive({
  id: '',
  displayName: '',
  buddy: 'bibo',
  lang: 'tl',
  band: 'usbong' as 'usbong' | 'puno',
})

const profiles = computed(() => data.value?.profiles ?? [])

onMounted(async () => {
  await profile.load()
  selectedId.value = profile.id
})

function languageName(lang: string) {
  return LANGUAGE_LABELS[lang] ?? lang
}

function resetForm() {
  form.id = ''
  form.displayName = ''
  form.buddy = 'bibo'
  form.lang = 'tl'
  form.band = 'usbong'
  formError.value = ''
}

function openCreate() {
  resetForm()
  formOpen.value = true
}

function openEdit(child: ProfileSummary) {
  form.id = child.id
  form.displayName = child.displayName
  form.buddy = child.avatar.buddy ?? 'bibo'
  form.lang = child.activeLang
  form.band = child.band
  formError.value = ''
  formOpen.value = true
}

function apiErrorMessage(err: unknown, fallback: string) {
  if (typeof err === 'object' && err && 'data' in err) {
    const data = (err as { data?: { statusMessage?: string; message?: string } }).data
    return data?.statusMessage || data?.message || fallback
  }
  return fallback
}

async function saveProfile() {
  if (saving.value) return
  saving.value = true
  formError.value = ''

  try {
    const body = {
      displayName: form.displayName,
      buddy: form.buddy,
      lang: form.lang,
      band: form.band,
    }
    if (form.id) {
      await $fetch(`/api/parent/profiles/${form.id}`, { method: 'PATCH', body })
    } else {
      await $fetch('/api/parent/profiles', { method: 'POST', body })
    }
    await refresh()
    formOpen.value = false
    resetForm()
  } catch (err) {
    formError.value = apiErrorMessage(err, 'Could not save this child profile.')
  } finally {
    saving.value = false
  }
}

async function deleteProfile(child: ProfileSummary) {
  if (deletingId.value || !window.confirm(`Delete ${child.displayName} and all saved progress?`)) return
  deletingId.value = child.id
  formError.value = ''

  try {
    await $fetch(`/api/parent/profiles/${child.id}`, { method: 'DELETE' })
    if (form.id === child.id) {
      formOpen.value = false
      resetForm()
    }
    await refresh()
  } catch (err) {
    formError.value = apiErrorMessage(err, 'Could not delete this child profile.')
  } finally {
    deletingId.value = ''
  }
}

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

async function useProfileAccount(child: ProfileSummary) {
  if (activatingId.value) return
  activatingId.value = child.id
  activationError.value = ''

  try {
    const result = await $fetch<{
      profile: {
        id: string
        avatar: Record<string, string>
        activeLang: 'tl' | 'ceb' | 'ilo' | 'hil'
        band: 'usbong' | 'puno'
        xp: number
      }
      boxes: Record<string, number>
    }>(`/api/parent/profiles/${child.id}`)
    await profile.activateRemote(result.profile, result.boxes)
    selectedId.value = child.id
    await navigateTo('/laro')
  } catch (err) {
    activationError.value = apiErrorMessage(err, 'Could not activate this child account.')
  } finally {
    activatingId.value = ''
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

      <section class="manage chunk">
        <div class="manage-head">
          <div>
            <p class="say">Family profiles</p>
            <h2 class="child-name">Manage child accounts</h2>
          </div>
          <button class="small-action lift" @click="formOpen ? (formOpen = false) : openCreate()">
            {{ formOpen ? 'Close' : 'Add child' }}
          </button>
        </div>

        <form v-if="formOpen" class="profile-form" @submit.prevent="saveProfile">
          <label class="field">
            <span>Child name</span>
            <input v-model.trim="form.displayName" type="text" minlength="2" maxlength="80" required />
          </label>
          <label class="field">
            <span>Buddy</span>
            <input v-model.trim="form.buddy" type="text" maxlength="40" required />
          </label>
          <label class="field">
            <span>Learning language</span>
            <select v-model="form.lang">
              <option value="tl">Tagalog</option>
              <option value="ceb">Cebuano</option>
              <option value="ilo">Ilocano</option>
              <option value="hil">Hiligaynon</option>
            </select>
          </label>
          <label class="field">
            <span>Learning band</span>
            <select v-model="form.band">
              <option value="usbong">Usbong, ages 4-7</option>
              <option value="puno">Puno, ages 8-12</option>
            </select>
          </label>
          <p v-if="formError" class="error" role="alert">{{ formError }}</p>
          <button class="play lift" type="submit" :disabled="saving">
            {{ saving ? 'Saving...' : form.id ? 'Save changes' : 'Create child' }}
          </button>
        </form>
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
              <p class="child-meta">{{ languageName(child.activeLang) }} · {{ child.band }}</p>
            </div>
            <div class="child-actions">
              <button
                class="small-action use-action"
                :class="{ selected: selectedId === child.id }"
                :disabled="activatingId === child.id"
                @click="useProfileAccount(child)"
              >
                {{ activatingId === child.id ? 'Opening...' : selectedId === child.id ? 'Using account' : 'Use account' }}
              </button>
              <button class="small-action" @click="openEdit(child)">Edit</button>
              <button
                class="small-action danger"
                :disabled="deletingId === child.id"
                @click="deleteProfile(child)"
              >
                {{ deletingId === child.id ? 'Deleting...' : 'Delete' }}
              </button>
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

      <p v-if="formError && profiles.length" class="error" role="alert">{{ formError }}</p>
      <p v-if="activationError" class="error" role="alert">{{ activationError }}</p>

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
  max-width: 1180px;
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

.manage {
  padding: 18px 20px;
  background: var(--papel);
}

.manage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.profile-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 18px;
  padding-top: 18px;
  border-top: 2px solid var(--papel-2);
}

.field {
  display: grid;
  gap: 6px;
  color: var(--tinta-2);
  font-size: 13px;
  font-weight: 800;
}

.field input,
.field select {
  width: 100%;
  min-height: 44px;
  padding: 8px 10px;
  border: var(--edge) solid var(--linya);
  border-radius: 10px;
  background: var(--papel-2);
  color: var(--tinta);
  font: inherit;
}

.profile-form .play {
  border: var(--edge) solid var(--linya);
  cursor: pointer;
}

.small-action {
  min-height: 38px;
  padding: 7px 12px;
  border: var(--edge) solid var(--linya);
  border-radius: 999px;
  background: var(--papel-2);
  color: var(--linya);
  cursor: pointer;
  font-family: var(--display);
  font-weight: 800;
}

.small-action:disabled,
.profile-form .play:disabled {
  cursor: wait;
  opacity: 0.6;
}

.danger {
  color: var(--sili);
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

.child-head > div:nth-child(2) {
  min-width: 0;
}

.child-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: auto;
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

.child-meta {
  margin-top: 5px;
  color: var(--tinta-2);
  font-size: 13px;
  font-weight: 800;
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
  .parent-home {
    gap: 14px;
  }

  .top {
    align-items: stretch;
  }

  .brand,
  .logout {
    min-height: 46px;
    display: inline-flex;
    align-items: center;
  }

  .hello,
  .manage,
  .child-card,
  .empty,
  .state {
    padding: 16px;
  }

  .manage-head {
    flex-direction: column;
  }

  .manage-head .small-action {
    width: 100%;
  }

  .profile-form {
    grid-template-columns: 1fr;
  }

  .manage-head,
  .child-head {
    align-items: flex-start;
  }

  .child-head {
    flex-wrap: wrap;
  }

  .child-actions {
    width: 100%;
    margin-left: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .child-actions .use-action {
    grid-column: 1 / -1;
  }

  .small-action {
    min-width: 0;
    padding-inline: 8px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .play {
    width: 100%;
  }

  .child-link {
    display: block;
    margin: 14px 0 0;
    text-align: center;
  }
}
</style>
