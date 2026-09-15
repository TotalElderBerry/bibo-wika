# Bibo Wika

A child-friendly app for learning **Tagalog, Cebuano, Ilocano and Hiligaynon**, for ages 4–12.

This repository is the **Phase 0 vertical slice**: one topic taken all the way through all four
languages, playable in two exercise types, with the infrastructure standing end to end. It exists to
prove three things before Phase 1 scales them — that the concept-keyed content model survives four
languages, that the four-column authoring pipeline works, and that a language lead can review a
lesson from a preview URL.

---

## Quick start

Node 20.11+ required.

```bash
corepack pnpm install
corepack pnpm dev
```

Open <http://localhost:3000>. **No database needed.** With no `DATABASE_URL` set, the pack endpoint
serves the authored content files directly, so a curriculum lead can see their words in the real app
on a fresh clone. The lesson screen shows a small `content: authored files` note when it is running
this way.

> If corepack fails with `Cannot find matching keyid`, its bundled registry keys are stale. Prefix
> the command with `COREPACK_INTEGRITY_KEYS=0`, or install pnpm directly.

---

## Connecting Neon

1. Create a Neon project in **AWS `ap-southeast-1` (Singapore)**. The region is not optional — the
   Vercel functions run in `sin1`, and a US-region database makes every query pay a trans-Pacific
   round trip that looks fine from a US laptop and terrible from Quezon City.
2. Copy `.env.example` to `.env` and fill in `NUXT_DATABASE_URL` with the **pooled** (`-pooler`)
   connection string.
3. Push the schema and load the content:

```bash
corepack pnpm db:generate   # generate SQL from server/db/schema.ts
corepack pnpm db:migrate    # apply to Neon
corepack pnpm db:seed       # push content/*.ts into the database
corepack pnpm db:studio     # optional: browse it
```

The app switches to the database automatically once `NUXT_DATABASE_URL` is present.

---

## Deploying to Vercel

**Step-by-step walkthrough: [DEPLOYING.md](DEPLOYING.md).** Summary below.

Import the repo; Vercel detects Nitro and wires it up. Then:

- **Region.** `vercel.json` pins functions to `sin1`. Keep it next to Neon.
- **Database.** Install the Neon integration from the Vercel marketplace. It injects `DATABASE_URL`
  and creates a copy-on-write **branch per preview deployment**, which is how a language lead
  reviews next week's lesson against real content without a local environment.
- **Autosuspend.** Leave it on for preview branches. Turn it **off** on production — a parent
  opening the dashboard should not wait for a database to wake.
- **Environment.** Set `NUXT_ADMIN_TOKEN`, the four `NUXT_R2_*` values, and
  `NUXT_PUBLIC_MEDIA_BASE`. Leave `NUXT_PUBLIC_DEV_TTS` unset or `false` — see *Audio* below.

### What deliberately does not run on Vercel

| Job | Where | Why |
| --- | --- | --- |
| Audio and artwork delivery | Cloudflare R2 + CDN | $0 egress. Vercel Blob bills transfer separately from the Pro bandwidth allowance. |
| Recording uploads | Direct to R2, presigned | A Vercel function body is capped at **4.5 MB**; a 48 kHz WAV master is bigger, and no config bypasses it. |
| ffmpeg normalise + encode | GitHub Actions | Long-running batch work; function duration is seconds, not hours. |

---

## Layout

```
content/            Authored source of truth. A curriculum lead edits these in a PR.
  types.ts            The concept model - read this first.
  hayop.ts            Phase 0 topic: 8 concepts x 4 languages.
server/
  db/schema.ts        The same model as Postgres (Drizzle).
  utils/db.ts         Neon over HTTP - no TCP pool to exhaust.
  api/pack/[lang]     One language pack, immutable and cacheable.
  api/compare/[id]    Salita Sabayan: one concept in all four languages.
  api/admin/*         Presigned R2 upload, transcode callback.
app/
  assets/css/main.css The visual system. Sticker book: thick ink outlines, hard
                      offset shadows, flat bright fills, day and night grounds.
  components/         BuddyAvatar, AnimalArt, TapCard, BiboButton, ProgressPips, StarBurst.
  pages/              index   landing page - the only screen written for an
                              adult. Prerendered, Taglish, and driven by the
                              real content files rather than screenshots.
                      laro/index    the child app: welcome on first run, hub
                                    after that. Also the PWA start_url.
                      pumili  buddy picker
                      wika    language picker
                      salita  Salita Sabayan browser - all four languages
                      laro/[topic]  the lesson
  stores/profile.ts   Local-first. A child never logs in.
scripts/seed.ts       content/ -> Neon.
.github/workflows/    Audio transcode pipeline.
```

---

## Screens and input

**`/` is the landing page, `/laro` is the app.** The landing page is the one screen written for an
adult — a parent, a teacher, or someone learning their own family's language — so it is Taglish,
prerendered for crawlers and link previews, and free of the 560px column the app screens live in.
The child app starts at `/laro`, which is also the PWA `start_url`: an installed icon opens on the
hub and a child is never handed marketing. Its Salita Sabayan demo is rendered from `content/hayop.ts`
directly, so the page cannot drift away from the product the way a marketing page usually does.

The app itself is playable on a phone, a tablet and a laptop. Wide screens are not just a wider
column — desktop means a mouse *and* a keyboard, and both are supported.

| Width | Layout |
| --- | --- |
| `< 700px` | Single column, max 560px. Phone. |
| `700–1023px` | Wider column (660px), larger art and type. Tablet. |
| `≥ 1024px` | Two-column stage, max 1080px. The prompt stops being a banner above the answers and becomes a standing panel beside them. Language picker becomes a 2×2 wall; buddy picker puts the chosen buddy in a pen on the left; the results screen puts the stars and Salita Sabayan side by side. |

The play area never grows past ~1080px on purpose. A four-year-old tracking four answer cards across
a 27-inch monitor is a worse experience, not a better one.

**Keyboard** (shown as hint chips only when there is a real pointer and a wide screen):

| Key | Does |
| --- | --- |
| `1`–`4` | Answer a listen round |
| `R` / `Space` | Replay the word |
| `Enter` | Next |
| `1`–`4` in Tugma | Modal: with no word chosen it picks the word, once one is chosen it picks the picture. The on-screen hints move to whichever column is live, so the mode is always visible rather than remembered. |
| `Esc` in Tugma | Clear the chosen word |

Hover lift is behind `@media (hover: hover) and (pointer: fine)` so a touch device never gets a stuck
hover state.

---

## Audio — read this before changing anything

There is **no usable text-to-speech for Cebuano, Ilocano or Hiligaynon**, in any browser or mobile
OS, and Filipino TTS is mediocre. Recorded native-speaker audio is a launch requirement, not a polish
item.

`NUXT_PUBLIC_DEV_TTS=true` enables placeholder speech so exercise flows can be built before the
studio recordings land. It approximates every language with a Filipino voice, which is wrong, and the
lesson screen shows a visible warning badge whenever it is used. **It must be off in any build a
child will touch.**

Only forms at `status: 'approved'` are ever played from a recording. Approval is a human decision,
taken twice per clip — one reviewer for pronunciation, one for technical quality. The transcode
workflow moves forms to `recorded` and stops there, on purpose.

---

## Phase 0 scope

**Done**

- Concept-keyed content model, four languages, in TypeScript and in Postgres
- Hayop topic: 8 concepts × 4 languages, with regional variants recorded
- Two exercise types: *Pakinggan at Pindutin* (listen and tap) and *Tugma* (match)
- Home hub — progress tiles, continue card, topic map with locked topics visible
- Landing page at `/`, prerendered and Taglish, with a live Salita Sabayan demo driven by the
  real content files. States the Phase 0 audio gap on the page rather than hiding it.
- *Salita Sabayan* — one concept in all four languages, as a browsable screen and
  as the end-of-lesson card. The product's differentiator.
- Six buddies as layered SVG, with idle / cheer / think / talk moods
- Sticker-book visual system, day and night, reduced-motion safe
- Phone / tablet / desktop layouts, with full keyboard play on wide screens
- Local-first profile and Leitner box state in IndexedDB
- Pack and compare endpoints, with a no-database fallback
- Presigned R2 upload path and the ffmpeg transcode workflow
- Vercel config pinned to `sin1`; PWA manifest and offline caching

**Not in Phase 0** — deliberately

- No recorded audio. Every form is `status: 'pending'`.
- No Puno (8–12) mode, no reading or spelling exercises
- No parent dashboard, no accounts, no Parent Gate
- No admin CMS UI — the API routes exist, the screens do not
- Avatar customisation axes (skin, hair, outfit, accessory) are specified but not built
- No PWA icons yet: `public/icons/*` need to be generated before install works properly

---

## Known gaps

- `pnpm typecheck` prints a Volar plugin resolution warning. It comes from a version mismatch
  between Nuxt's generated tsconfig and vue-router 4.6, not from this code, and typecheck passes.
- `@pinia/nuxt` 1.x requires Pinia 4. Do not downgrade one without the other.
- The transcode workflow's `mark-recorded` call needs `APP_URL` and `ADMIN_TOKEN` repository secrets.
