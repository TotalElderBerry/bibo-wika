<script setup lang="ts">
import { BUDDIES, type BuddyName } from '~/utils/buddies'
import { LANGS, LANG_META, type Lang } from '~~/content/types'

/**
 * The parent dashboard.
 *
 * Every screen in this app except this one and the landing page is written for
 * a child. This one is written for an adult, and it is the only place where
 * anything can be created, renamed or deleted.
 */
/**
 * Destructured, not `const auth = useAuth()`.
 *
 * `parent` is a ref, and Vue only unwraps refs that are top-level setup
 * bindings - a ref reached through a plain object stays a ref in the template.
 * `auth.parent?.displayName` was therefore always undefined, and the greeting
 * on this page rendered as a bare "Kumusta, .".
 */
const { parent: parentAccount, logout } = useAuth()
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

const BAND_LABELS: Record<'usbong' | 'puno', string> = {
  usbong: 'Usbong, edad 4-7',
  puno: 'Puno, edad 8-12',
}

const { data, pending, error: loadError, refresh } = await useFetch<ProfilesResponse>(
  '/api/parent/profiles',
)

const linking = ref(false)
const linkError = ref('')
const linkName = ref('')
const linked = ref(false)
const formOpen = ref(false)
const saving = ref(false)
const deletingId = ref('')
const activatingId = ref('')
const selectedId = ref('')
const formError = ref('')
/** Delete and activate failures. Kept apart from formError, which lives inside
    the add/edit form and is invisible while that form is closed. */
const listError = ref('')

const form = reactive({
  id: '',
  displayName: '',
  buddy: 'tikoy' as BuddyName,
  lang: 'tl' as Lang,
  band: 'usbong' as 'usbong' | 'puno',
})

const profiles = computed(() => data.value?.profiles ?? [])

onMounted(async () => {
  await profile.load()
  selectedId.value = profile.id
  linkName.value = ''
})

function languageName(lang: string) {
  return LANG_META[lang as Lang]?.name ?? lang
}

function bandName(band: 'usbong' | 'puno') {
  return BAND_LABELS[band] ?? band
}

/** The stored buddy is free text as far as Postgres knows; the child app can
    only draw the six in the roster. */
function safeBuddy(value: string | undefined): BuddyName {
  return BUDDIES.some((b) => b.id === value) ? (value as BuddyName) : 'tikoy'
}

function resetForm() {
  form.id = ''
  form.displayName = ''
  form.buddy = 'tikoy'
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
  form.buddy = safeBuddy(child.avatar.buddy)
  form.lang = (LANGS as readonly string[]).includes(child.activeLang)
    ? (child.activeLang as Lang)
    : 'tl'
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
    formError.value = apiErrorMessage(err, 'Hindi ma-save ang profile na ito.')
  } finally {
    saving.value = false
  }
}

async function deleteProfile(child: ProfileSummary) {
  if (deletingId.value) return
  if (!window.confirm(`Burahin si ${child.displayName} at ang lahat ng progreso niya?`)) return

  deletingId.value = child.id
  listError.value = ''

  try {
    await $fetch(`/api/parent/profiles/${child.id}`, { method: 'DELETE' })
    if (form.id === child.id) {
      formOpen.value = false
      resetForm()
    }
    // The device keeps its own copy - this account simply no longer mirrors it.
    if (selectedId.value === child.id) selectedId.value = ''
    await refresh()
  } catch (err) {
    listError.value = apiErrorMessage(err, 'Hindi mabura ang profile na ito.')
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
      throw new Error('Magsimula muna ng profile ng bata sa app bago ito i-link.')
    }

    const name = linkName.value.trim()
    if (name.length < 2 || name.length > 80) {
      throw new Error('Kailangan ng pangalan ng bata, 2 hanggang 80 letra.')
    }

    await $fetch('/api/parent/profiles/link', {
      method: 'POST',
      body: {
        id: profile.id,
        // The child app never asks a four-year-old to type a name, so the
        // device has none to send. The parent supplies it here rather than the
        // dashboard silently filing the child under their buddy's name.
        displayName: name,
        buddy: profile.buddy,
        lang: profile.lang,
        band: profile.band,
        xp: profile.xp,
        boxes: profile.boxes,
      },
    })
    linked.value = true
    selectedId.value = profile.id
    await refresh()
  } catch (err) {
    linkError.value =
      err instanceof Error ? err.message : apiErrorMessage(err, 'Hindi ma-link ang profile na ito.')
  } finally {
    linking.value = false
  }
}

async function useProfileAccount(child: ProfileSummary) {
  if (activatingId.value) return
  activatingId.value = child.id
  listError.value = ''

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
    listError.value = apiErrorMessage(err, 'Hindi mabuksan ang account na ito.')
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
      <button class="logout lift" @click="logout">Lumabas</button>
    </header>

    <main class="grow dash">
      <section class="hello chunk">
        <p class="say">Dashboard ng magulang</p>
        <h1 class="heading">Kumusta, {{ parentAccount?.displayName }}.</h1>
        <p class="quiet">
          Tingnan ang progreso ng mga batang naka-link sa account na ito. Ang mga bata ay hindi
          kailangang mag-log in para maglaro.
        </p>
      </section>

      <section class="manage chunk">
        <div class="manage-head">
          <div>
            <p class="say">Mga profile ng pamilya</p>
            <h2 class="child-name">Pamahalaan ang mga bata</h2>
          </div>
          <button class="small-action lift" @click="formOpen ? (formOpen = false) : openCreate()">
            {{ formOpen ? 'Isara' : 'Magdagdag' }}
          </button>
        </div>

        <form v-if="formOpen" class="profile-form" @submit.prevent="saveProfile">
          <label class="field">
            <span>Pangalan ng bata</span>
            <input v-model.trim="form.displayName" type="text" minlength="2" maxlength="80" required />
          </label>
          <label class="field">
            <span>Kaibigan</span>
            <!-- A select, not free text: the child app can only draw these six,
                 and anything else silently became Tikoy at play time. -->
            <select v-model="form.buddy">
              <option v-for="b in BUDDIES" :key="b.id" :value="b.id">
                {{ b.label }} - {{ b.species }}
              </option>
            </select>
          </label>
          <label class="field">
            <span>Wikang inaaral</span>
            <select v-model="form.lang">
              <option v-for="l in LANGS" :key="l" :value="l">{{ LANG_META[l].name }}</option>
            </select>
          </label>
          <label class="field">
            <span>Antas</span>
            <select v-model="form.band">
              <option value="usbong">Usbong, edad 4-7</option>
              <option value="puno">Puno, edad 8-12</option>
            </select>
          </label>
          <p v-if="formError" class="error" role="alert">{{ formError }}</p>
          <button class="play lift" type="submit" :disabled="saving">
            {{ saving ? 'Sini-save...' : form.id ? 'I-save ang pagbabago' : 'Gumawa ng profile' }}
          </button>
        </form>
      </section>

      <p v-if="listError" class="error" role="alert">{{ listError }}</p>

      <!-- One chain, one visible state. These four used to be broken apart by
           error paragraphs, which left the empty state rendering underneath a
           full list of children. -->
      <p v-if="loadError" class="error" role="alert">
        Hindi ma-load ang mga naka-link na profile. Pakisubukang mag-refresh.
      </p>

      <section v-else-if="pending" class="chunk state">Naglo-load...</section>

      <section v-else-if="profiles.length" class="profiles">
        <article v-for="child in profiles" :key="child.id" class="chunk child-card">
          <div class="child-head">
            <span class="child-avatar">
              <BuddyAvatar :name="safeBuddy(child.avatar.buddy)" :size="54" />
            </span>
            <div>
              <p class="say">Profile ng bata</p>
              <h2 class="child-name">{{ child.displayName }}</h2>
              <p class="child-meta">
                {{ languageName(child.activeLang) }} &middot; {{ bandName(child.band) }}
              </p>
            </div>
            <div class="child-actions">
              <button
                class="small-action use-action"
                :class="{ selected: selectedId === child.id }"
                :disabled="activatingId === child.id"
                @click="useProfileAccount(child)"
              >
                {{
                  activatingId === child.id
                    ? 'Binubuksan...'
                    : selectedId === child.id
                      ? 'Ginagamit'
                      : 'Gamitin'
                }}
              </button>
              <button class="small-action" @click="openEdit(child)">Baguhin</button>
              <button
                class="small-action danger"
                :disabled="deletingId === child.id"
                @click="deleteProfile(child)"
              >
                {{ deletingId === child.id ? 'Binubura...' : 'Burahin' }}
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
              <span class="tile-l">Nasanay</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ child.stats.mastered }}</span>
              <span class="tile-l">Kabisado</span>
            </div>
            <div class="tile">
              <span class="tile-n">{{ child.stats.due }}</span>
              <span class="tile-l">Balikan</span>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="chunk empty">
        <p class="say">Wala pang naka-link</p>
        <h2 class="child-name">Dalhin dito ang progreso ng device na ito.</h2>
        <p class="quiet">
          Magsimula ng profile sa app ng bata, tapos i-link ito dito. Patuloy pa ring maglalaro
          ang bata nang lokal; nagdaragdag lang ito ng backup at pagtingin para sa magulang.
        </p>

        <label class="field">
          <span>Pangalan ng bata</span>
          <input
            v-model.trim="linkName"
            type="text"
            minlength="2"
            maxlength="80"
            placeholder="Halimbawa: Maria"
          />
        </label>

        <p v-if="linked" class="success" role="status">
          Na-link na. Lalabas dito ang progreso.
        </p>
        <p v-if="linkError" class="error" role="alert">{{ linkError }}</p>
        <button class="play lift" :disabled="linking" @click="linkCurrentProfile">
          {{ linking ? 'Nili-link...' : 'I-link ang profile sa device na ito' }}
        </button>
        <NuxtLink to="/laro" class="child-link">Buksan ang app ng bata</NuxtLink>
      </section>

      <NuxtLink v-if="profiles.length" to="/laro" class="play lift">
        Buksan ang app ng bata
      </NuxtLink>
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

/* Holds a BuddyAvatar now, not the raw buddy id as text. The buddy carries
   its own outline and colour, so this is only a box to sit in. */
.child-avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 58px;
  height: 58px;
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
