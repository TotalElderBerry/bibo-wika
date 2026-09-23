# Bibo Wika

**Four Philippine languages, one game.** Tagalog, Cebuano, Ilocano and Hiligaynon — taught side by
side to children aged 4–12, and to the adults who grew up hearing them without ever being taught
them.

> **Status: pre-launch.** Six topics and 48 concepts are authored in all four languages and playable
> today. **No audio has been recorded and no native reviewer has signed off any word yet** — every
> form is `status: 'pending'`. Nothing here should reach a child until that changes. The specifics
> are in [Audio](#audio--read-this-before-changing-anything) and
> [Content review](#content-review--read-before-shipping-any-of-this).

---

## Why this exists
 
A Filipino child often has a Cebuano lola and an Ilocano lolo, hears Tagalog at school, and ends up
fluent in none of the three. The apps that could help have two blind spots:

**They treat a language as an island.** Every general-purpose language app teaches one language at a
time, in isolation, as though a learner's family speaks one. That framing is wrong for the
Philippines, and it hides the single most useful fact available to a Filipino learner: these
languages are relatives. A child who learns `tatlo` has most of the way to `tulo` and `tallo`.

**They only speak Tagalog.** Filipino text-to-speech is mediocre, and for Cebuano, Ilocano and
Hiligaynon there is **no usable text-to-speech at all**, in any browser or mobile OS. An app built on
synthetic speech can only ever ship one of these four languages honestly. That is why recorded
native-speaker audio is treated here as a launch requirement rather than a polish item.

Bibo Wika is built around both facts: content is keyed by **concept** rather than by word, so all
four languages are first-class and a fifth is a data task; and nothing is ever played to a child
except a recording a human being approved.

---

## What it does

### Salita Sabayan — one word, four languages, side by side

The feature the product exists for. Pick any concept and see it in all four languages at once, with
child-facing respelling and the regional alternates a real family would use. It is a browsable screen
of its own, and it closes every lesson.

| Concept | Tagalog | Cebuano | Ilocano | Hiligaynon |
| --- | --- | --- | --- | --- |
| `family.sibling` | kapatid | igsoon | kabsat | utod |
| `number.three` | tatlo | tulo | tallo | tatlo |
| `greeting.good_morning` | magandang umaga | maayong buntag | naimbag a bigat | maayong aga |
| `animal.chicken` | manok | manok | manok | manok |

Four rows, four different lessons: total divergence, obvious family resemblance, four different
sentence constructions, and one word the whole country shares.

### Keyed by concept, never by word

Content is keyed by **concept**, never by word. One concept owns one picture and one meaning; each
language contributes a form.

This is not an abstraction for its own sake. In Cebuano, `langgam` means **bird**. In Tagalog,
`langgam` means **ant**. Same spelling, different animal. A word-keyed model gets that wrong; a
concept-keyed one cannot, because the picture belongs to the concept and the word only ever hangs off
it. Adding a fifth language is a column of data, not an engineering project.

### Regional variants are correct answers, not mistakes

A child in Bohol who says `ido` for dog is not wrong, and is never told they are. Variants are
accepted in exercises and surfaced in Salita Sabayan as the thing your lola might say. Where a
Spanish loan and a native word compete — `berde` against `lunhaw`, `dalag` against `amarilyo` — the
taught form is the one a child actually hears, and the other is accepted rather than corrected.

### Two ways to play, and no way to lose

*Pakinggan at Pindutin* — listen, then tap the picture. *Tugma* — match four sounds to four
pictures, tap-then-tap rather than drag-and-drop, because dragging is fiddly for four-year-old hands
on a phone and two taps is not.

There is no timer, no buzzer, and no way to fail. A wrong answer wobbles, the buddy looks thoughtful,
and the card stays available. Mastery is tracked per concept **per language** with Leitner boxes — a
child who learns `dog` in Cebuano still meets it fresh in Ilocano, because they are genuinely
different words.

### Six buddies and a sticker-book world

Tikoy the tarsier, Kalab the carabao, Haribon the eagle, Pawi the sea turtle, Maya and Sari — six
Philippine animals drawn as layered SVG with idle, cheer, think and talk moods. The whole visual
system is a sticker book: thick ink outlines, hard offset shadows, flat bright fills, and a day and a
night ground the child can switch between. Every animation respects `prefers-reduced-motion`.

Concept artwork is drawn per concept and shared by all four languages — a dog is a dog whether the
child is being taught `aso`, `iro` or `ido`.

### A child never logs in

Profiles are local-first. A child picks a buddy and a language and starts playing; their progress
lives in IndexedDB on the device and reaches no server at all unless an adult chooses otherwise.
There is no account, no email, no password, and nothing to collect.

### Parent accounts, for the adults who want them

An optional adult account at `/magulang` adds a dashboard: which words each child has practised, how
many are mastered, and how many are due for review. A parent can create and manage child profiles,
and link the profile already on the device — progress merges upward, so linking an old phone can
never demote what a newer one has taught.

### Plays on a phone, a tablet and a laptop

One column on a phone, a wider one on a tablet, and a two-column stage on desktop where the prompt
becomes a standing panel beside the answers. Desktop also means a keyboard: `1`–`4` to answer, `R` or
`Space` to replay, `Enter` to continue. The play area never grows past ~1080px on purpose — a
four-year-old tracking four cards across a 27-inch monitor is a worse experience, not a better one.

### Installable and offline

A PWA whose `start_url` is `/laro`, the child's hub — an installed icon opens on the game and a child
is never handed marketing. Language packs are versioned, cached whole, and served from the authored
content files when there is no database at all.

Installing is not finished: the icons under `public/icons/` still need generating, so add-to-home
works but looks wrong. Offline play does not depend on it.

---

## The curriculum

Six topics, 48 concepts, 192 forms. Every concept appears in all four languages.

| Topic | English | Concepts | What it carries |
| --- | --- | --- | --- |
| **Hayop** | Animals | 8 | The first topic written, and the trap that proves the model: Cebuano `langgam` is a bird, Tagalog `langgam` is an ant |
| **Pagkain** | Food | 8 | Daily vocabulary and the Visayan `lubi` / Luzon `niyog` line that runs through the audience |
| **Kulay** | Colours | 8 | The one topic where the picture *is* the meaning, so the artwork is a paint swatch |
| **Bilang** | Numbers 1–8 | 8 | The clearest family resemblance in the app — four inherited sets of the same numerals |
| **Pamilya** | Family | 8 | `kapatid / igsoon / kabsat / utod`, the strongest four-way split in the curriculum |
| **Pagbati** | Greetings | 8 | The only topic made of phrases, and four different ways to build the same sentence |

A curriculum lead edits these as TypeScript files under `content/` and reviews them in a pull
request; `pnpm db:seed` projects them into Postgres. No database is needed to see your words in the
real app — see [Quick start](#quick-start).

---

## Where it is today

**Built and working**

- Concept-keyed content model, four languages, in TypeScript and in Postgres
- Six topics — 48 concepts × 4 languages, **drafted and unreviewed**, with regional variants and
  registers recorded
- Two exercise types: *Pakinggan at Pindutin* and *Tugma*
- Home hub — progress tiles, per-topic progress and stars, a continue card that points at the first
  unfinished topic, and a locked row kept for whatever is announced next
- *Salita Sabayan*, as a browsable screen and as the end-of-lesson card
- Landing page at `/`, prerendered and Taglish, with a live Salita Sabayan demo driven by the real
  content files. It states the audio gap on the page rather than hiding it
- Six buddies as layered SVG with four moods; sticker-book visual system, day and night,
  reduced-motion safe
- Phone / tablet / desktop layouts, with full keyboard play on wide screens
- Local-first profile and Leitner box state in IndexedDB
- Versioned pack and compare endpoints, with a no-database fallback
- Parent accounts, same-device profile linking, and a first progress dashboard
- Presigned R2 upload path and the ffmpeg transcode workflow
- Vercel config pinned to `sin1`; PWA manifest and offline caching

**Not built yet** — deliberately, and stated rather than implied

- **No recorded audio, and no reviewed text.** Every form is `status: 'pending'`
- No Puno (8–12) mode, no reading or spelling exercises
- No adult track. The `matanda` band exists end to end and is disabled everywhere it appears — see
  [What's next](#whats-next)
- Cross-device profile pairing, background sync, password recovery, and a Parent Gate
- No admin CMS UI — the API routes exist, the screens do not
- Avatar customisation axes (skin, hair, outfit, accessory) are specified but not built
- No PWA icons yet: `public/icons/*` need generating before install works properly
- No rate limit on the login endpoint. Put one in front of it before a public beta

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

---

## What's next

### Dialect learning for adults

The same four languages, for someone learning the language their own family speaks — the Ilocano of a
lolo, the Cebuano of a lola. It is announced on the landing page and defined in `content/roadmap.ts`.
**It is reachable from nowhere**, and everything below says so in the UI rather than quietly doing
nothing.

The groundwork that exists today:

| Piece | State |
| --- | --- |
| `matanda` band | In the content model, the Postgres enum (migration `0002`), the profile store, the API validators |
| Concepts marked for it | All 48. The words an adult beginner needs are the words a child needs; what differs is pace, framing and exercise type, not which nouns exist |
| Band picker | Listed and **disabled** in the parent dashboard, labelled *malapit na* |

The three planned features, and what each still needs:

- **Sariling account.** An adult logs in as themselves rather than as a child under a parent.
  Structurally this is the account and session machinery that already exists — `parent_accounts` and
  `parent_sessions` — pointed at a profile the account owns for itself, with `band: 'matanda'`. The
  table name will read wrong on the day an adult who is nobody's parent signs up; renaming it is a
  migration and a find-replace, cheapest done before there is data.
- **Advanced lessons.** Two of the eleven exercise types in spec section 06 are built, both
  picture-and-sound. Reading, spelling and sentence-level exercises are the gap, and nothing filters
  a lesson by band yet — `build()` in `app/pages/laro/[topic].vue` uses every concept in the topic.
- **Vocabulary deck.** The only one of the three with no model at all. It needs a table, and its
  shape depends on two open questions: does a deck belong to a profile or to an account, and is it
  distinct from the Leitner `progress` rows? A deck is curated by a person; `progress` is written by
  the system. Deliberately not invented in advance.

A naming note: `matanda` means "old", which will read oddly to a 25-year-old learning their lola's
Ilocano. One enum value and one migration to change, while nothing depends on it.

### Also planned

Puno mode for 8–12s, reading and spelling exercises, the remaining nine exercise types, an admin CMS
for the four-column translation view, avatar customisation, and cross-device pairing.

---

# For developers

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

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server, no database required |
| `pnpm typecheck` | `nuxt typecheck` |
| `pnpm build` | Production build |
| `pnpm db:generate` | Generate SQL from `server/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations to Neon |
| `pnpm db:seed` | Push `content/*.ts` into the database |
| `pnpm db:studio` | Browse the database |

## Connecting Neon

1. Create a Neon project in **AWS `ap-southeast-1` (Singapore)**. The region is not optional — the
   Vercel functions run in `sin1`, and a US-region database makes every query pay a trans-Pacific
   round trip that looks fine from a US laptop and terrible from Quezon City.
2. Copy `.env.example` to `.env` and fill in `NUXT_DATABASE_URL` with the **pooled** (`-pooler`)
   connection string.
3. `pnpm db:migrate` then `pnpm db:seed`.

The app switches to the database automatically once `NUXT_DATABASE_URL` is present.

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
  `NUXT_PUBLIC_MEDIA_BASE`. Leave `NUXT_PUBLIC_DEV_TTS` unset or `false` — see *Audio* above.

### What deliberately does not run on Vercel

| Job | Where | Why |
| --- | --- | --- |
| Audio and artwork delivery | Cloudflare R2 + CDN | $0 egress. Vercel Blob bills transfer separately from the Pro bandwidth allowance. |
| Recording uploads | Direct to R2, presigned | A Vercel function body is capped at **4.5 MB**; a 48 kHz WAV master is bigger, and no config bypasses it. |
| ffmpeg normalise + encode | GitHub Actions | Long-running batch work; function duration is seconds, not hours. |

## Layout

```
content/            Authored source of truth. A curriculum lead edits these in a PR.
  types.ts            The concept model and the age bands - read this first.
  topics.ts           The registry, in teaching order. Every consumer reads this.
  hayop.ts            Animals    - 8 concepts x 4 languages.
  pagkain.ts          Food       - 8 concepts x 4 languages.
  kulay.ts            Colours    - 8 concepts x 4 languages.
  bilang.ts           Numbers    - 8 concepts x 4 languages.
  pamilya.ts          Family     - 8 concepts x 4 languages.
  pagbati.ts          Greetings  - 8 concepts x 4 languages, and the only
                      topic made of phrases rather than single words.
  roadmap.ts          Announced but not built. No topics left in it; the adult
                      track and its three features live here.
server/
  db/schema.ts        The same model as Postgres (Drizzle).
  utils/db.ts         Neon over HTTP - no TCP pool to exhaust.
  utils/auth.ts       Parent accounts: scrypt, sessions, cookies.
  utils/profile-input.ts  Shared validation for the three profile routes.
  api/pack/[lang]     One language pack, versioned by content fingerprint.
  api/compare/[id]    Salita Sabayan: one concept in all four languages.
  api/auth/*          Register, login, logout, session.
  api/parent/*        Child profiles, progress summaries, device linking.
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

## Screens and input

**`/` is the landing page, `/laro` is the app.** The landing page is the one screen written for an
adult — a parent, a teacher, or someone learning their own family's language — so it is Taglish,
prerendered for crawlers and link previews, and free of the 560px column the app screens live in.
The child app starts at `/laro`, which is also the PWA `start_url`: an installed icon opens on the
hub and a child is never handed marketing. Its Salita Sabayan demo is rendered from the real content
files across all six topics, so the page cannot drift away from the product the way a marketing page
usually does.

| Width | Layout |
| --- | --- |
| `< 700px` | Single column, max 560px. Phone. |
| `700–1023px` | Wider column (660px), larger art and type. Tablet. |
| `≥ 1024px` | Two-column stage, max 1080px. The prompt stops being a banner above the answers and becomes a standing panel beside them. Language picker becomes a 2×2 wall; buddy picker puts the chosen buddy in a pen on the left; the results screen puts the stars and Salita Sabayan side by side. |

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

## Content releases — how a new word reaches a child

`/api/pack/:lang` is cached hard, so the URL carries a fingerprint of everything under `content/`:
`/api/pack/tl?v=9ff97406d58e`. New content is a new fingerprint, a new URL, and therefore a fetch
that no cache can answer from the past. **A content change only reaches anyone after a rebuild** —
the fingerprint is computed in `nuxt.config.ts` at build time. Two things follow:

- In development the fingerprint does not move when you edit `content/`, so the pack route sends
  `no-store` there. A curriculum lead sees their words on reload.
- When the admin CMS lands, content edited **directly in Postgres will not move the fingerprint**.
  Either write CMS changes back to `content/` and redeploy, or give the pack a version that comes
  from the database instead. This is the trap to remember.

Before this, the route advertised a year-long `immutable` cache in `nuxt.config.ts` and a one-hour
one from `defineCachedEventHandler`. The handler won — Nitro rewrites `cache-control` from its own
`maxAge` and replays it from the cache entry — so the route rule was dead config, and every release
was invisible to a returning child for up to an hour at the browser and another hour at the Nitro
cache, whichever expired last.

## Parent accounts

`/magulang` is the one part of the app that **cannot run without a database**. Everything a child
touches works from the authored content files; a parent account needs somewhere to keep a profile,
so with no `NUXT_DATABASE_URL` the login form answers "kailangan ng database" and stops there.

What the account does and does not own:

- **The dashboard owns the child's name, buddy, language and band.** Linking a device again will not
  overwrite them — a device has no name to send, and re-linking used to file the child under their
  buddy's name.
- **Linking merges progress upward.** A Leitner box only ever moves up and `seen` is never reset, so
  linking an old phone cannot demote what a newer device has already taught.
- **The buddy is a closed set**, enforced on the server against the same six in
  `app/utils/buddies.ts`. A buddy outside the roster is one the child app cannot draw.
- **A profile row is claimed by id.** `profiles.parent_id` is `ON DELETE SET NULL`, so a family that
  closes an account and opens a new one can re-link the profile still on their device. A row already
  owned by a different account is refused.

Passwords are scrypt with a server-side pepper (`NUXT_AUTH_PEPPER`); sessions are 30-day httpOnly
cookies, pruned per account on sign-in. A login for an address with no account spends the same time
as a real verification, so the endpoint does not leak which families have accounts.

## Known gaps

- `pnpm typecheck` prints a Volar plugin resolution warning. It comes from a version mismatch
  between Nuxt's generated tsconfig and vue-router 4.6, not from this code, and typecheck passes.
- `@pinia/nuxt` 1.x requires Pinia 4. Do not downgrade one without the other.
- The transcode workflow's `mark-recorded` call needs `APP_URL` and `ADMIN_TOKEN` repository secrets.
- `package.json` still lists a `pack:build` script pointing at `scripts/build-packs.ts`, which does
  not exist in the tree.
