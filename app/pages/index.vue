<script setup lang="ts">
import { LANGS, LANG_META } from '~~/content/types'
import { topics } from '~~/content/topics'
import { upcoming } from '~~/content/roadmap'
import { BUDDIES } from '~/utils/buddies'

/**
 * Landing page.
 *
 * This is `/` - the page a parent, a teacher or an adult learner lands on from
 * a shared link, and the only page in the app written for an adult. The child
 * app starts at `/laro`, which is also the PWA `start_url`, so an installed
 * app never opens on marketing.
 *
 * It is prerendered to a static file, so everything it shows has to come from
 * `content/` rather than an API call. That is deliberate beyond build config:
 * the Salita Sabayan demo below is driven by the real content files, not a
 * screenshot of them, so this page cannot quietly drift away from the product
 * the way a marketing page usually does.
 *
 * Copy is Taglish. The audience is Filipino parents and teachers, plus adults
 * learning the language their own family speaks - not an export market.
 */
const profile = useProfile()
const ground = useGround()

/**
 * Live Salita Sabayan demo, driven by the actual content files.
 *
 * One or two concepts per topic, picked for how far the four languages move
 * apart - `kapatid / igsoon / kabsat / utod` sells this product better than
 * any sentence on this page can. `animal.bird` is first because the langgam
 * trap explained below depends on it.
 */
const DEMO_IDS = [
  'animal.bird',
  'animal.dog',
  'food.rice',
  'food.water',
  'colour.yellow',
  'number.three',
  'family.sibling',
  'greeting.good_morning',
]

const allConcepts = topics.flatMap((t) => t.concepts)
const demo = DEMO_IDS.map((id) => allConcepts.find((c) => c.id === id)).filter((c) => !!c)

const pick = ref(0)
const concept = computed(() => demo[pick.value]!)

const buddies = BUDDIES

useHead({
  title: 'Bibo Wika - Tagalog, Cebuano, Ilocano at Hiligaynon para sa mga bata',
})

useSeoMeta({
  description:
    'Isang app para matutunan ang Tagalog, Cebuano, Ilocano at Hiligaynon. Para sa edad 4-12 at sa kahit sinong gustong matuto ng wika ng pamilya. Libre, walang account, gumagana offline.',
  ogTitle: 'Bibo Wika - apat na wika, isang laro',
  ogDescription:
    'Tagalog, Cebuano, Ilocano at Hiligaynon sa isang app. Isang konsepto, apat na wika, magkatabi.',
  ogType: 'website',
  ogLocale: 'fil_PH',
})
</script>

<template>
  <div class="land">
    <!-- ============================================================= nav -->
    <header class="nav">
      <div class="wrap nav-in">
        <span class="mark">Bibo&nbsp;Wika</span>

        <nav class="nav-links" aria-label="Mga seksyon">
          <a href="#wika">Mga wika</a>
          <a href="#sabayan">Salita Sabayan</a>
          <a href="#bakit">Bakit ito</a>
        </nav>

        <button class="icon-btn lift" :aria-label="ground.label.value" @click="ground.toggle">
          {{ ground.icon.value }}
        </button>

        <NuxtLink v-if="profile.started" to="/laro" class="nav-cta lift">Magpatuloy</NuxtLink>
        <NuxtLink v-else to="/pumili" class="nav-cta lift">Maglaro</NuxtLink>
      </div>
    </header>

    <main>
      <!-- ========================================================== hero -->
      <section class="hero">
        <div class="wrap hero-in">
          <div class="hero-txt">
            <p class="eyebrow">
              <span class="pill">Edad 4-12</span>
              <span class="pill">Libre</span>
              <span class="pill">Walang ads</span>
            </p>

            <h1 class="h-xl">Apat na wika.<br />Isang laro.</h1>

            <p class="lede">
              Tagalog, Cebuano, Ilocano at Hiligaynon - sa isang app na ginawa para sa mga bata, at
              para sa kahit sinong gustong matuto ng wika ng sarili niyang pamilya. Walang account,
              walang bayad, at gumagana kahit walang signal.
            </p>

            <div class="cta-row">
              <NuxtLink to="/pumili" class="cta cta-main lift">Magsimula</NuxtLink>
              <NuxtLink to="/salita" class="cta cta-alt lift">Tingnan ang Salita Sabayan</NuxtLink>
              <NuxtLink to="/magulang/login" class="cta cta-parent lift">Para sa magulang</NuxtLink>
            </div>

            <p v-if="profile.started" class="cta-note">
              Nandito ka na dati?
              <NuxtLink to="/laro">Ituloy ang nasimulan mo</NuxtLink>
            </p>
            <p v-else class="cta-note">Walang sign-up. Diretso sa laro.</p>
          </div>

          <div class="hero-art" aria-hidden="true">
            <div class="card-stack">
              <div class="peek chunk tilt-l">
                <ConceptArt art="butterfly" :size="56" />
                <span class="peek-w">paruparo</span>
                <span class="wika-chip w-tl">TL</span>
              </div>
              <div class="peek chunk tilt-r">
                <ConceptArt art="carabao" :size="56" />
                <span class="peek-w">nuang</span>
                <span class="wika-chip w-ilo">ILO</span>
              </div>
              <div class="peek chunk tilt-l">
                <ConceptArt art="cat" :size="56" />
                <span class="peek-w">kuring</span>
                <span class="wika-chip w-hil">HIL</span>
              </div>
            </div>

            <div class="crowd">
              <BuddyAvatar name="tikoy" :size="96" class="c1" />
              <BuddyAvatar name="sari" :size="84" class="c2" />
              <BuddyAvatar name="pawi" :size="76" class="c3" />
            </div>
          </div>
        </div>
      </section>

      <!-- Honest, and on purpose. A landing page that oversells a Phase 0
           slice burns the trust of exactly the parents we need. -->
      <aside class="note">
        <div class="wrap note-in">
          <span class="note-tag">Maagang bersyon</span>
          <p>
            Bukas na ang <strong>anim na aralin</strong> - 48 salita sa apat na wika, mula
            hayop hanggang pagbati. Ineere-record pa ng mga native speaker ang mga boses, at
            hinihintay pa ang pag-apruba ng mga tagasuri sa bawat wika, kaya wala pang tunog ang
            mga salita. Ang natitira sa app ay totoo at nalalaro na ngayon.
          </p>
        </div>
      </aside>

      <!-- ========================================================== wika -->
      <section id="wika" class="sec">
        <div class="wrap">
          <p class="kicker">Apat na wika</p>
          <h2 class="h-lg">Hindi lang Tagalog</h2>
          <p class="sub">
            Karamihan ng mga app ay Filipino lang. Dito, magkapantay ang apat - may sariling gabay,
            sariling salita at sariling boses ang bawat wika. Pumili ng isa, o subukan lahat.
          </p>

          <div class="grid-4">
            <article v-for="l in LANGS" :key="l" class="chunk wcard" :class="`accent-${l}`">
              <span class="wika-chip" :class="`w-${l}`">{{ l.toUpperCase() }}</span>
              <h3 class="wcard-nm">{{ LANG_META[l].name }}</h3>
              <p class="wcard-en">{{ LANG_META[l].endonym }}</p>
              <p class="wcard-guide">
                Gabay: <strong>{{ LANG_META[l].guide }}</strong>
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- ======================================================= sabayan -->
      <section id="sabayan" class="sec sec-alt">
        <div class="wrap">
          <p class="kicker">Ang kaibahan namin</p>
          <h2 class="h-lg">Salita Sabayan</h2>
          <p class="sub">
            Isang konsepto, apat na wika, magkatabi. Pindutin ang larawan - ito mismo ang nilalaman
            ng app, hindi larawan nito.
          </p>

          <div class="demo">
            <div class="demo-pick" role="group" aria-label="Pumili ng salita">
              <button
                v-for="(c, i) in demo"
                :key="c.id"
                class="chip-art lift"
                :class="{ on: i === pick }"
                :aria-pressed="i === pick"
                @click="pick = i"
              >
                <ConceptArt :art="c.art" :size="34" />
                <span class="chip-en">{{ c.en }}</span>
              </button>
            </div>

            <div class="demo-panel chunk">
              <div class="demo-head">
                <ConceptArt :art="concept.art" :size="76" />
                <div>
                  <p class="say">Konsepto</p>
                  <h3 class="demo-en">{{ concept.en }}</h3>
                  <p class="demo-id">{{ concept.id }}</p>
                </div>
              </div>

              <ul class="forms">
                <li v-for="l in LANGS" :key="l" class="form">
                  <span class="wika-chip" :class="`w-${l}`">{{ l.toUpperCase() }}</span>
                  <span class="form-txt">
                    <span class="form-w">{{ concept.forms[l].text }}</span>
                    <span class="form-r">{{ concept.forms[l].respell }}</span>
                  </span>
                  <span v-if="concept.forms[l].variants?.length" class="form-v">
                    o <strong>{{ concept.forms[l].variants!.join(', ') }}</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div class="chunk gotcha">
            <p class="say">Bakit konsepto, hindi salita</p>
            <p class="gotcha-txt">
              Sa Cebuano, <strong>langgam</strong> ang tawag sa <em>ibon</em>. Sa Tagalog, ang
              <strong>langgam</strong> ay <em>insekto</em>. Parehong baybay, magkaibang hayop.
              Dahil nakakabit ang lahat sa isang konsepto - isang larawan, isang kahulugan - hindi
              ito nagkakamali, kahit magdagdag pa kami ng panlimang wika.
            </p>
          </div>
        </div>
      </section>

      <!-- ========================================================= bakit -->
      <section id="bakit" class="sec">
        <div class="wrap">
          <p class="kicker">Bakit ito</p>
          <h2 class="h-lg">Ginawa para sa totoong pamilyang Pilipino</h2>

          <div class="grid-2">
            <article class="chunk why">
              <span class="why-ic" aria-hidden="true">🎙️</span>
              <h3 class="why-nm">Tunay na boses, hindi robot</h3>
              <p class="why-tx">
                Walang maaasahang text-to-speech para sa Cebuano, Ilocano at Hiligaynon - kaya
                recorded native speakers ang plano, hindi sintetikong boses. Dadaan ang bawat clip
                sa dalawang native reviewer bago ito marinig ng isang bata.
              </p>
            </article>

            <article class="chunk why">
              <span class="why-ic" aria-hidden="true">🗺️</span>
              <h3 class="why-nm">Tama rin ang sinasabi ng lola mo</h3>
              <p class="why-tx">
                Sa Bohol, <strong>ido</strong> ang aso - hindi <strong>iro</strong>. Tinatanggap
                namin ang dalawa. Hindi kailanman mamamali ang batang sumusunod sa sariling bayan.
              </p>
            </article>

            <article class="chunk why">
              <span class="why-ic" aria-hidden="true">📴</span>
              <h3 class="why-nm">Walang account, gumagana offline</h3>
              <p class="why-tx">
                Nasa device lang ang progreso ng bata. Walang login, walang email, walang ads,
                walang tracking - at tuloy ang laro kahit nawalan ng signal.
              </p>
            </article>

            <article class="chunk why">
              <span class="why-ic" aria-hidden="true">🧸</span>
              <h3 class="why-nm">Walang parusa</h3>
              <p class="why-tx">
                Malalaki ang pindutan, walang timer, walang buzzer. Kapag mali, nag-iisip lang ang
                buddy at inuulit ang salita. Ulit-ulit ang dating, hindi pasa-bagsak.
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- ========================================================= paano -->
      <section class="sec sec-alt">
        <div class="wrap">
          <p class="kicker">Paano maglaro</p>
          <h2 class="h-lg">Tatlong pindot bago magsimula</h2>

          <ol class="steps">
            <li class="chunk step">
              <span class="step-n">1</span>
              <div class="step-body">
                <h3 class="step-nm">Pumili ng buddy</h3>
                <p class="step-tx">Anim na hayop na Pilipino ang kasama ng bata sa buong laro.</p>
                <div class="step-buddies" aria-hidden="true">
                  <BuddyAvatar v-for="b in buddies" :key="b.id" :name="b.id" :size="44" />
                </div>
              </div>
            </li>

            <li class="chunk step">
              <span class="step-n">2</span>
              <div class="step-body">
                <h3 class="step-nm">Pumili ng wika</h3>
                <p class="step-tx">
                  Puwedeng palitan kahit kailan. Hiwalay ang progreso sa bawat wika, kaya hindi
                  nawawala ang naunang natutunan.
                </p>
                <div class="step-chips">
                  <span v-for="l in LANGS" :key="l" class="wika-chip" :class="`w-${l}`">
                    {{ LANG_META[l].name }}
                  </span>
                </div>
              </div>
            </li>

            <li class="chunk step">
              <span class="step-n">3</span>
              <div class="step-body">
                <h3 class="step-nm">Maglaro</h3>
                <p class="step-tx">
                  Dalawang uri ng laro: <strong>Pakinggan at Pindutin</strong> - marinig ang salita,
                  pindutin ang tamang larawan. <strong>Tugma</strong> - ipares ang salita sa
                  larawan. Nagtatapos ang bawat aralin sa Salita Sabayan.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- ======================================================== kanino -->
      <section class="sec">
        <div class="wrap">
          <p class="kicker">Para kanino</p>
          <h2 class="h-lg">Hindi lang para sa mga bata</h2>

          <div class="grid-3">
            <article class="chunk who">
              <h3 class="who-nm">Mga magulang</h3>
              <p class="who-tx">
                Para sa pamilyang lumaki sa ibang bayan - o sa ibang bansa - at gustong marinig ng
                anak ang wika ng mga lolo at lola. Iabot ang tablet, ayos na.
              </p>
            </article>

            <article class="chunk who">
              <h3 class="who-nm">Mga guro</h3>
              <p class="who-tx">
                Mother tongue at Filipino sa iisang lugar. Isang konsepto, apat na wika - kita agad
                kung saan nagkakapareho at saan nagkakaiba ang mga salita.
              </p>
            </article>

            <article class="chunk who">
              <h3 class="who-nm">Mga adult learner</h3>
              <p class="who-tx">
                Marunong ka ng Tagalog pero gusto mong maintindihan ang Bisaya ng asawa mo? Simple
                ang laro pero totoo ang nilalaman - at hindi ka nito bibilisan.
              </p>
            </article>
          </div>
        </div>
      </section>

      <!-- ======================================================= susunod -->
      <section class="sec sec-alt">
        <div class="wrap">
          <p class="kicker">Ang kurikulum</p>
          <h2 class="h-lg">Anim na aralin, bukas lahat</h2>
          <p class="sub">
            Walang naka-lock. Bawat aralin ay walong konsepto, at bawat konsepto ay nasa apat na
            wika - kaya 48 salita bawat wika, 192 lahat.
          </p>

          <div class="soon">
            <span v-for="t in topics" :key="t.slug" class="chunk soon-chip">
              <strong>{{ t.title.tl }}</strong>
              <span class="soon-en">{{ t.en }}</span>
            </span>
          </div>

          <div v-if="upcoming.length" class="soon">
            <span v-for="u in upcoming" :key="u.slug" class="chunk soon-chip soon-next">
              <strong>{{ u.title.tl }}</strong>
              <span class="soon-en">Malapit na</span>
            </span>
          </div>
        </div>
      </section>

      <!-- ====================================================== last cta -->
      <section class="last">
        <div class="wrap last-in">
          <BuddyAvatar name="tikoy" :size="104" class="last-buddy" />
          <h2 class="h-lg">Simulan natin?</h2>
          <p class="sub">Walang account, walang bayad. Isang pindot at nasa unang aralin ka na.</p>
          <NuxtLink to="/pumili" class="cta cta-main lift">Magsimula</NuxtLink>
        </div>
      </section>
    </main>

    <footer class="foot">
      <div class="wrap foot-in">
        <span class="mark">Bibo&nbsp;Wika</span>
        <nav class="foot-links" aria-label="Mga link">
          <NuxtLink to="/pumili">Maglaro</NuxtLink>
          <NuxtLink to="/salita">Salita Sabayan</NuxtLink>
          <NuxtLink to="/wika">Mga wika</NuxtLink>
        </nav>
        <p class="foot-note">
          Tagalog · Cebuano · Ilocano · Hiligaynon. Maagang bersyon - hindi pa kumpleto ang audio.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* -----------------------------------------------------------------------------
   The landing page is the one screen that is NOT `.screen`. The child app caps
   itself at 1080px because a four-year-old should not have to track answer
   cards across a 27-inch monitor; an adult reading a page has the opposite
   need, so sections go full-bleed and only the content column is capped.
----------------------------------------------------------------------------- */
.land {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.wrap {
  width: 100%;
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: 18px;
}

@media (min-width: 700px) {
  .wrap {
    padding-inline: 28px;
  }
}

/* ------------------------------------------------------------------- nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  padding-block: 10px;
  background: color-mix(in srgb, var(--ground-1) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: var(--edge) solid var(--linya);
}

.nav-in {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mark {
  font-family: var(--display);
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--tinta);
}

.nav-links {
  display: none;
  margin-left: 18px;
  gap: 18px;
}

.nav-links a {
  font-size: 15px;
  font-weight: 800;
  color: var(--tinta-2);
  text-decoration: none;
}

.nav-links a:hover {
  color: var(--tinta);
}

@media (min-width: 860px) {
  .nav-links {
    display: flex;
  }
}

.icon-btn {
  margin-left: auto;
  flex: none;
  width: 42px;
  height: 42px;
  font-size: 18px;
  line-height: 1;
  background: var(--papel);
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
  box-shadow: 0 4px 0 var(--lift);
}

.icon-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

/* `--linya`, not `--tinta`, for anything sitting on a sticker colour. The
   sticker palette is identical in both grounds, but `--tinta` flips to cream
   at night - which lands cream ink on a yellow button at about 1.4:1. The ink
   line colour is dark in both grounds, which is exactly what is needed here. */
.nav-cta {
  flex: none;
  font-family: var(--display);
  font-size: 16px;
  font-weight: 800;
  color: var(--linya);
  text-decoration: none;
  background: var(--mangga);
  border: var(--edge) solid var(--linya);
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--lift);
  padding: 8px 18px;
}

.nav-cta:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

/* ------------------------------------------------------------------ hero */
.hero {
  padding-block: 40px 32px;
}

.hero-in {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.eyebrow {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 16px;
}

.pill {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tinta);
  background: var(--papel);
  border: 2.5px solid var(--linya);
  border-radius: 999px;
  padding: 3px 11px;
}

.h-xl {
  font-family: var(--display);
  font-size: clamp(40px, 11vw, 68px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--tinta);
}

.lede {
  margin-top: 16px;
  font-size: clamp(16px, 4vw, 19px);
  font-weight: 700;
  line-height: 1.55;
  color: var(--tinta);
  max-width: 48ch;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  /* 64px minimum target, the same rule the app plays by. */
  min-height: 64px;
  padding: 14px 28px;
  font-family: var(--display);
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
  border: var(--edge) solid var(--linya);
  border-radius: var(--round);
  box-shadow: 0 var(--drop) 0 var(--lift);
  touch-action: manipulation;
  transition:
    transform 0.09s var(--ease),
    box-shadow 0.09s var(--ease);
}

.cta:active {
  transform: translateY(var(--drop));
  box-shadow: 0 0 0 var(--lift);
}

.cta-main {
  background: var(--mangga);
  color: var(--linya);
}

.cta-alt {
  background: var(--papel);
  color: var(--tinta);
}

.cta-parent {
  background: var(--dahon);
  color: #fff;
}

/* On a phone the two buttons sit on their own rows anyway, so let them match
   width - a narrow primary beside a wide secondary reads as the smaller of
   the two choices, which is backwards. */
@media (max-width: 520px) {
  .cta {
    width: 100%;
  }
}

.cta-note {
  margin-top: 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--tinta-2);
}

.cta-note a {
  color: var(--tinta);
}

/* hero art */
.hero-art {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.card-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 320px;
}

.peek {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
}

.peek-w {
  font-family: var(--display);
  font-size: 22px;
  font-weight: 800;
}

.peek .wika-chip {
  margin-left: auto;
  font-size: 11px;
}

.crowd {
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.c2 {
  margin-left: -14px;
  animation-delay: 0.4s;
}

.c3 {
  margin-left: -12px;
  animation-delay: 0.8s;
}

@media (min-width: 900px) {
  .hero {
    padding-block: 60px 44px;
  }

  .hero-in {
    flex-direction: row;
    align-items: center;
    gap: 48px;
  }

  .hero-txt {
    flex: 1 1 56%;
  }

  .hero-art {
    flex: 1 1 44%;
  }
}

/* ------------------------------------------------------------------ note
   A dashed border, not a sticker card: this is a caveat, not a feature. */
.note {
  padding-block: 4px 28px;
}

.note-in {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px 14px;
  max-width: 900px;
  padding: 14px 18px;
  background: var(--papel-2);
  border: 2.5px dashed var(--linya);
  border-radius: var(--round-sm);
}

.note-tag {
  flex: none;
  font-family: var(--display);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--linya);
  background: var(--sili);
  border: 2.5px solid var(--linya);
  border-radius: 999px;
  padding: 2px 11px;
}

.note-in p {
  flex: 1 1 260px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--tinta);
}

/* -------------------------------------------------------------- sections */
.sec {
  padding-block: 44px;
  /* The nav is sticky, so an anchor jump would otherwise park the heading
     underneath it. */
  scroll-margin-top: 74px;
}

.sec-alt {
  background: color-mix(in srgb, var(--papel) 26%, transparent);
  border-block: var(--edge) solid var(--linya);
}

.kicker {
  font-family: var(--ui);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--tinta-2);
  margin-bottom: 8px;
}

.h-lg {
  font-family: var(--display);
  font-size: clamp(27px, 6.5vw, 40px);
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--tinta);
}

.sub {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.55;
  color: var(--tinta);
  max-width: 62ch;
}

.grid-4,
.grid-3,
.grid-2 {
  display: grid;
  gap: 14px;
  margin-top: 26px;
}

@media (min-width: 620px) {
  .grid-4,
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ------------------------------------------------------------ wika cards */
.wcard {
  padding: 16px 16px 18px;
  border-top-width: 9px;
}

.wcard.accent-tl {
  border-top-color: var(--tl);
}
.wcard.accent-ceb {
  border-top-color: var(--ceb);
}
.wcard.accent-ilo {
  border-top-color: var(--ilo);
}
.wcard.accent-hil {
  border-top-color: var(--hil);
}

.wcard-nm {
  margin-top: 10px;
  font-family: var(--display);
  font-size: 22px;
  font-weight: 800;
}

.wcard-en {
  font-size: 14px;
  font-weight: 700;
  color: var(--tinta-2);
  margin-top: 2px;
}

.wcard-guide {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--tinta-2);
}

/* ------------------------------------------------------------------ demo */
.demo {
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-pick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip-art {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px 7px 8px;
  background: var(--papel);
  border: 2.5px solid var(--linya);
  border-radius: 999px;
  box-shadow: 0 4px 0 var(--lift);
}

.chip-art:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--lift);
}

.chip-art.on {
  background: var(--mangga);
  color: var(--linya);
}

.chip-en {
  font-family: var(--display);
  font-size: 14px;
  font-weight: 800;
  text-transform: capitalize;
}

.demo-panel {
  padding: 18px;
}

.demo-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 2.5px dashed color-mix(in srgb, var(--tinta-2) 45%, transparent);
}

.demo-en {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 800;
  text-transform: capitalize;
  line-height: 1.1;
}

.demo-id {
  font-family: var(--ui);
  font-size: 12px;
  font-weight: 700;
  color: var(--tinta-2);
}

.forms {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 12px;
  padding: 9px 4px;
}

.form + .form {
  border-top: 2px solid color-mix(in srgb, var(--tinta-2) 22%, transparent);
}

.form .wika-chip {
  flex: none;
  min-width: 52px;
  text-align: center;
  font-size: 11px;
}

.form-txt {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.form-w {
  font-family: var(--display);
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 800;
  line-height: 1.15;
}

.form-r {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: var(--tinta-2);
}

.form-v {
  margin-left: auto;
  font-size: 13px;
  font-weight: 700;
  color: var(--tinta-2);
}

@media (min-width: 900px) {
  .demo {
    display: grid;
    grid-template-columns: 250px 1fr;
    align-items: start;
    gap: 22px;
  }

  .demo-pick {
    flex-direction: column;
    align-items: stretch;
  }

  .chip-art {
    border-radius: var(--round-sm);
  }
}

.gotcha {
  margin-top: 18px;
  padding: 16px 18px;
  background: var(--papel-2);
}

.gotcha-txt {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.55;
  max-width: 68ch;
}

.gotcha-txt em {
  font-style: normal;
  color: var(--tinta-2);
}

/* ------------------------------------------------------------------- why */
.why {
  padding: 18px;
}

.why-ic {
  font-size: 26px;
  line-height: 1;
}

.why-nm {
  margin-top: 10px;
  font-family: var(--display);
  font-size: 21px;
  font-weight: 800;
}

.why-tx {
  margin-top: 7px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.55;
  color: var(--tinta);
}

/* ----------------------------------------------------------------- steps */
.steps {
  list-style: none;
  margin: 26px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step {
  display: flex;
  gap: 14px;
  padding: 18px;
}

.step-n {
  flex: none;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  font-family: var(--display);
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  background: var(--ube);
  border: var(--edge) solid var(--linya);
  border-radius: 50%;
}

.step-nm {
  font-family: var(--display);
  font-size: 22px;
  font-weight: 800;
}

.step-tx {
  margin-top: 6px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.55;
  max-width: 62ch;
}

.step-buddies {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 12px;
}

.step-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}

/* ------------------------------------------------------------------- who */
.who {
  padding: 18px;
}

.who-nm {
  font-family: var(--display);
  font-size: 21px;
  font-weight: 800;
}

.who-tx {
  margin-top: 7px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.55;
}

/* ------------------------------------------------------------------ soon */
.soon {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.soon-chip {
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
}

/* Announced but not authored yet - dashed and dimmed, the same signal the
   child app uses for a locked topic. Nothing wears this today. */
.soon-next {
  background: transparent;
  border-style: dashed;
  border-width: 2.5px;
  box-shadow: none;
  opacity: 0.85;
}

.soon-chip strong {
  font-family: var(--display);
  font-size: 18px;
  font-weight: 800;
}

.soon-en {
  font-size: 12px;
  font-weight: 700;
  color: var(--tinta-2);
}

/* -------------------------------------------------------------- last cta */
.last {
  padding-block: 52px 60px;
  text-align: center;
}

.last-in {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.last .sub {
  margin-inline: auto;
  text-align: center;
}

.last .cta {
  margin-top: 22px;
  min-width: 240px;
}

.last-buddy {
  margin-bottom: 8px;
}

/* ---------------------------------------------------------------- footer */
.foot {
  margin-top: auto;
  padding-block: 22px max(22px, env(safe-area-inset-bottom));
  border-top: var(--edge) solid var(--linya);
  background: color-mix(in srgb, var(--papel) 26%, transparent);
}

.foot-in {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 20px;
}

.foot-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.foot-links a {
  font-size: 15px;
  font-weight: 800;
  color: var(--tinta-2);
  text-decoration: none;
}

.foot-links a:hover {
  color: var(--tinta);
}

.foot-note {
  flex: 1 1 100%;
  font-size: 13px;
  font-weight: 700;
  color: var(--tinta-2);
}
</style>
