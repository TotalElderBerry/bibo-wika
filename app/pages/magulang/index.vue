<script setup lang="ts">
const auth = useAuth()

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
          Your account is ready. Child profile sync and family controls can plug into this space
          next without changing the child-first play flow.
        </p>
      </section>

      <section class="grid">
        <article class="chunk tile">
          <span class="tile-n">0</span>
          <span class="tile-l">Synced profiles</span>
        </article>
        <article class="chunk tile">
          <span class="tile-n">0</span>
          <span class="tile-l">Devices linked</span>
        </article>
      </section>

      <NuxtLink to="/laro" class="play lift">Open child app</NuxtLink>
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
