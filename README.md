# Bibo Wika

A child-friendly app for learning **Tagalog, Cebuano, Ilocano and Hiligaynon**, for ages 4–12.

This repository holds the **full Usbong curriculum draft**: six topics, 48 concepts, each one
authored in all four languages, playable in two exercise types, with the infrastructure standing end
to end. It started as a one-topic vertical slice and now carries the whole first band.

**Every form is still `status: 'pending'`.** The words are drafted, not approved: no clip has been
recorded and no native reviewer has signed off. Read *Audio* and *Content review* below before
putting any of this in front of a child.

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
  topics.ts           The registry, in teaching order. Every consumer reads this.
  hayop.ts            Animals    - 8 concepts x 4 languages.
  pagkain.ts          Food       - 8 concepts x 4 languages.
  kulay.ts            Colours    - 8 concepts x 4 languages.
  bilang.ts           Numbers    - 8 concepts x 4 languages.
  pamilya.ts          Family     - 8 concepts x 4 languages.
  pagbati.ts          Greetings  - 8 concepts x 4 languages, and the only
                      topic made of phrases rather than single words.
  roadmap.ts          Announced but not authored. Empty - all five planned
                      topics have been written.
server/
  db/schema.ts        The same model as Postgres (Drizzle).
  utils/db.ts         Neon over HTTP - no TCP pool to exhaust.
  api/pack/[lang]     One language pack, immutable and cacheable.
  api/compare/[id]    Salita Sabayan: one concept in all four languages.
  api/admin/*         Presigned R2 upload, transcode callback.
app/
  assets/css/main.css The visual system. Sticker book: thick ink outlines, hard
                      offset shadows, flat bright fills, day and night grounds.
  components/         BuddyAvatar, ConceptArt, TapCard, BiboButton, ProgressPips, StarBurst.
  pages/              index   landing page - the only screen written for an
                              adult. Prerendered, Taglish, and driven by the
                              real content files rather than screenshots.
                      laro/index    the child app: welcome on first run, hub
                                    after that. Also the PWA start_url.
                      pumili  buddy picker
                      wika    language picker
                      salita  Salita Sabayan browser - all four languages
                      laro/[topic]  the lesson
                      magulang  parent login and linked-profile dashboard
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
- Six topics — hayop, pagkain, kulay, bilang, pamilya, pagbati — 48 concepts × 4 languages,
  **drafted and unreviewed**, with regional variants and registers recorded
- Two exercise types: *Pakinggan at Pindutin* (listen and tap) and *Tugma* (match)
- Home hub — progress tiles, per-topic progress and stars, a continue card that points at the
  first unfinished topic, and the locked-topic row kept for whatever is announced next
- Landing page at `/`, prerendered and Taglish, with a live Salita Sabayan demo driven by the
  real content files. States the Phase 0 audio gap on the page rather than hiding it.
- *Salita Sabayan* — one concept in all four languages, as a browsable screen and
  as the end-of-lesson card. The product's differentiator.
- Six buddies as layered SVG, with idle / cheer / think / talk moods
- Sticker-book visual system, day and night, reduced-motion safe
- Phone / tablet / desktop layouts, with full keyboard play on wide screens
- Local-first profile and Leitner box state in IndexedDB
- Pack and compare endpoints, with a no-database fallback
- Parent accounts, same-device profile linking, and a first progress dashboard
- Presigned R2 upload path and the ffmpeg transcode workflow
- Vercel config pinned to `sin1`; PWA manifest and offline caching

**Not in Phase 0** — deliberately

- No recorded audio, and no reviewed text. Every form is `status: 'pending'`.
- No Puno (8–12) mode, no reading or spelling exercises
- Cross-device profile pairing, background sync, password recovery, and a Parent Gate are not built
- No admin CMS UI — the API routes exist, the screens do not
- Avatar customisation axes (skin, hair, outfit, accessory) are specified but not built
- No PWA icons yet: `public/icons/*` need to be generated before install works properly

---

## Content review — read before shipping any of this

The six topics were drafted in one pass. Tagalog and Cebuano are the most reliable; Ilocano and
Hiligaynon need the closest reading. Each language needs a native reviewer to walk every form before
it goes near the recording booth, and these specific calls are the ones to argue with first:

| Where | The call that was made | Why it needs a second pair of eyes |
| --- | --- | --- |
| `colour.orange` | `kahel` in all four, with `orange` as an accepted variant | The weakest entry in the set. `kahel` is the fruit in Tagalog and may not be the everyday colour word in any of the other three; `orange` may simply be the honest answer everywhere. |
| `food.banana` (ilo) | `saba` | `saba` is a specific cultivar in several languages, not the generic fruit. If Ilocano uses `saging` generically, swap them and keep `saba` as the variant. |
| `greeting.youre_welcome` | `walang anuman` / `walay sapayan` / `awan ti anyaman` / `wala sing ano-ano` | Long, formal, and four different constructions. Check that each is what a child actually hears, not what a phrasebook prints. |
| `family.baby` | `sanggol` / `masuso` / `maladaga` / `lapsag` | Four unrelated words, each plausible; the register differences between them are the risk. |
| `family.mother`, `family.father` | spoken form taught, formal form as a variant | Deliberate: `nanay` over `ina`. Confirm that is right for Ilocano `nanang` and Hiligaynon `iloy` too. |
| `colour.yellow` (ceb, hil) | `dalag` taught, `amarilyo` as variant | Which one wins is a household-by-household question, not a regional one. |
| Every `respell` | Stress marked in caps | Stress was assigned by ear from the standard form. It is the single most likely thing to be wrong, and it is what a child will imitate. |
| Every `ipa` | Omitted on multi-word greetings | Deliberate — phrase-level transcription invites false precision. Decide phrasing at the microphone. |

Nothing above blocks the app from running; all of it blocks a recording session.

## Parent accounts

`/magulang` is the one part of the app that **cannot run without a database**. Everything a child
touches works from the authored content files; a parent account needs somewhere to keep a profile,
so with no `NUXT_DATABASE_URL` the login form answers "kailangan ng database" and stops there.

What the account does and does not own:

- **The dashboard owns the child's name, buddy, language and band.** Linking a device again will not
  overwrite them - a device has no name to send, and re-linking used to file the child under their
  buddy's name.
- **Linking merges progress upward.** A Leitner box only ever moves up and `seen` is never reset, so
  linking an old phone cannot demote what a newer device has already taught.
- **The buddy is a closed set**, enforced on the server against the same six in
  `app/utils/buddies.ts`. A buddy outside the roster is one the child app cannot draw.
- **A profile row is claimed by id.** `profiles.parent_id` is `ON DELETE SET NULL`, so a family that
  closes an account and opens a new one can re-link the profile still on their device. A row already
  owned by a different account is refused.

Still not built, and still listed under Phase 0 scope: password recovery, cross-device pairing,
background sync, and a Parent Gate. There is no rate limit on the login endpoint - put one in front
of it before a public beta.

## Known gaps

- `pnpm typecheck` prints a Volar plugin resolution warning. It comes from a version mismatch
  between Nuxt's generated tsconfig and vue-router 4.6, not from this code, and typecheck passes.
- `@pinia/nuxt` 1.x requires Pinia 4. Do not downgrade one without the other.
- The transcode workflow's `mark-recorded` call needs `APP_URL` and `ADMIN_TOKEN` repository secrets.
