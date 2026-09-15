<script setup lang="ts">
const auth = useAuth()

const displayName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  if (loading.value) return
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    await auth.register(displayName.value, email.value, password.value)
    await navigateTo('/magulang')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Create parent account - Bibo Wika' })
</script>

<template>
  <div class="auth-screen">
    <main class="auth-wrap">
      <section class="intro">
        <NuxtLink to="/" class="mark">Bibo&nbsp;Wika</NuxtLink>
        <p class="kicker">Parent account</p>
        <h1 class="auth-title">Keep the child app simple.</h1>
        <p class="auth-copy">
          Create an adult account for family settings and future progress sync. The play experience
          remains local-first and child-friendly.
        </p>
        <NuxtLink to="/magulang/login" class="back lift">I already have an account</NuxtLink>
      </section>

      <form class="auth-card chunk" @submit.prevent="submit">
        <div>
          <p class="say">Set up access</p>
          <h2 class="heading">Create account</h2>
        </div>

        <label class="field">
          <span>Name</span>
          <input
            v-model.trim="displayName"
            autocomplete="name"
            name="name"
            placeholder="Your name"
            type="text"
            required
          />
        </label>

        <label class="field">
          <span>Email</span>
          <input
            v-model.trim="email"
            autocomplete="email"
            inputmode="email"
            name="email"
            placeholder="you@example.com"
            type="email"
            required
          />
        </label>

        <label class="field">
          <span>Password</span>
          <input
            v-model="password"
            autocomplete="new-password"
            minlength="8"
            name="password"
            placeholder="At least 8 characters"
            type="password"
            required
          />
        </label>

        <label class="field">
          <span>Confirm password</span>
          <input
            v-model="confirmPassword"
            autocomplete="new-password"
            minlength="8"
            name="confirm-password"
            placeholder="Repeat password"
            type="password"
            required
          />
        </label>

        <p v-if="error" class="error" role="alert">{{ error }}</p>

        <BiboButton type="submit" tone="dahon" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create account' }}
        </BiboButton>
      </form>
    </main>
  </div>
</template>

<style scoped>
.auth-screen {
  min-height: 100dvh;
  padding: max(18px, env(safe-area-inset-top)) 18px max(18px, env(safe-area-inset-bottom));
  display: grid;
  place-items: center;
}

.auth-wrap {
  width: min(100%, 980px);
  display: grid;
  gap: 22px;
}

.intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.mark {
  font-family: var(--display);
  font-size: 25px;
  font-weight: 800;
  color: var(--tinta);
  text-decoration: none;
  margin-bottom: 26px;
}

.kicker {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--tinta-2);
}

.auth-title {
  margin-top: 8px;
  font-family: var(--display);
  font-size: clamp(36px, 9vw, 58px);
  line-height: 1.02;
  font-weight: 800;
  color: var(--tinta);
  max-width: 10ch;
}

.auth-copy {
  margin-top: 16px;
  max-width: 42ch;
  font-size: 17px;
  line-height: 1.55;
  color: var(--tinta);
}

.back {
  display: inline-flex;
  margin-top: 22px;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: 8px 18px;
  font-family: var(--display);
  font-weight: 800;
  color: var(--linya);
  text-decoration: none;
  background: var(--mangga);
  border: var(--edge) solid var(--linya);
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--lift);
}

.back:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.auth-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field span {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--tinta-2);
}

.field input {
  width: 100%;
  min-height: 56px;
  padding: 12px 15px;
  font: inherit;
  color: var(--tinta);
  background: var(--papel-2);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
}

.field input::placeholder {
  color: color-mix(in srgb, var(--tinta-2) 70%, transparent);
}

.error {
  padding: 10px 12px;
  font-size: 14px;
  color: #fff;
  background: var(--sili);
  border: var(--edge) solid var(--linya);
  border-radius: var(--round-sm);
}

@media (min-width: 860px) {
  .auth-wrap {
    grid-template-columns: 1fr minmax(360px, 430px);
    align-items: center;
    gap: 52px;
  }

  .auth-card {
    padding: 26px;
  }
}
</style>
