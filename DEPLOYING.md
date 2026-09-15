# Deploying Bibo Wika to Vercel

Three stages, in this order. **Each one ends with something working**, so if you stop halfway you
still have a live site rather than a broken one.

| Stage | What you get | Time |
| --- | --- | --- |
| 1 | A live, fully playable app. **No database, no accounts, no env vars.** | ~10 min |
| 2 | The content served from Neon instead of the authored files | ~15 min |
| 3 | Real audio from Cloudflare R2 | later — there are no recordings yet |

Stage 1 works on its own because `/api/pack/[lang]` falls back to `content/hayop.ts` when no database
is configured. That is deliberate: it means you can get a URL in front of people today.

---

## Stage 1 — get it live

### 1.1 Make it a git repository

From the project root:

```bash
git init -b main
```

```bash
git add -A && git commit -m "Bibo Wika: Phase 0 vertical slice"
```

`.gitignore` already excludes `node_modules`, `.nuxt`, `.output`, `.env` and `.vercel`, so nothing
secret goes in. Check with `git status` before you commit if you want to be sure.

### 1.2 Push to GitHub

Create an **empty** repository at <https://github.com/new> — no README, no .gitignore, no licence, or
the first push will conflict. Then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/bibo-wika.git
```

```bash
git push -u origin main
```

### 1.3 Import into Vercel

1. Go to <https://vercel.com/new>
2. Pick the `bibo-wika` repository
3. Leave **every** build setting alone. Vercel detects Nuxt and Nitro with zero configuration — it
   reads `packageManager` from `package.json`, installs with the right pnpm, runs `nuxt build`, and
   turns `server/api/**` into one Vercel Function.
4. Do **not** add any environment variables yet
5. Click **Deploy**

You get a URL. Open it: buddy picker → language picker → a playable Hayop lesson.

### 1.4 Confirm the region took

This is the one setting that matters and the one that silently goes wrong.

`vercel.json` pins functions to `sin1` (Singapore). Vercel's default for new projects is `iad1`
(Washington DC) — from Manila that adds a trans-Pacific round trip to every request, and it looks
perfectly fine from a laptop in the US.

Check under **Project → Settings → Functions → Function Regions**, or on the deployment summary. It
should say Singapore.

> Hobby plan allows **one** region, but you choose which one, so `sin1` is fine on any plan.
> Listing more regions than your plan allows fails the deployment before the build even starts.

---

## Stage 2 — add the database

### 2.1 Create the Neon project

At <https://console.neon.tech>, create a project with:

- **Region: AWS `ap-southeast-1` (Singapore)** — must match the Vercel region from 1.4. A Neon
  project in the US behind functions in Singapore is the same latency bug, just on the other side.
- Database name: `bibo`

### 2.2 Connect it to Vercel

Install the Neon integration from <https://vercel.com/marketplace/neon> and link it to the project.

This does two things worth understanding:

- It injects `DATABASE_URL` into your Vercel environments automatically
- It creates a **copy-on-write branch of the database for every preview deployment**, and deletes it
  when the preview closes

That second one is the real prize. It means a Cebuano language lead can be sent a preview URL for
next week's lesson, running against a real copy of the content, and reject a word — with no local
environment and no risk to production.

> **Name note.** The integration sets `DATABASE_URL`. This app's own variable is
> `NUXT_DATABASE_URL`. Both work — `server/utils/db.ts` reads the Nuxt runtime config first and falls
> back to `process.env.DATABASE_URL`. If you connect Neon manually instead of through the
> integration, set `NUXT_DATABASE_URL` and use the **pooled** connection string (the host containing
> `-pooler`).

### 2.3 Create the tables and load the content

Migrations do not run during the Vercel build, on purpose — a build should not be able to alter a
production database. Run them from your machine, once, pointed at production.

Put the production pooled connection string in a local `.env`:

```bash
cp .env.example .env
```

Edit `NUXT_DATABASE_URL` in it, then:

```bash
corepack pnpm db:generate
```

```bash
corepack pnpm db:migrate
```

```bash
corepack pnpm db:seed
```

Verify with `corepack pnpm db:studio`, or in the Neon console's table editor. You should see 1 topic,
8 concepts and 32 forms — all `status: pending`.

### 2.4 Turn off autosuspend on production

In the Neon console, on the **production** branch's compute: disable autosuspend, or set a minimum
compute above zero.

Neon suspends compute after five minutes idle on every plan. That is exactly what you want on preview
branches and exactly what you do not want on production, where it means a parent opening the app
waits for a database to wake up. It costs money — roughly $19/month for a 0.25 CU always-on compute
at Launch pricing — so it is a real trade, not a free win.

### 2.5 Redeploy and confirm

Trigger a redeploy (push a commit, or **Deployments → ⋯ → Redeploy**).

The lesson screen shows a small `content: authored files (no database connected)` note at the bottom
whenever it is running on the fallback. **When Neon is wired up correctly, that note disappears.**
That is your check.

---

## Stage 3 — media (do this when recordings exist)

Nothing here is needed until there is audio. The app is silent but fully playable without it.

1. Create a Cloudflare R2 bucket (`bibo-media`)
2. R2 → **Manage API Tokens** → create a token with **Object Read & Write** on that bucket
3. Put a custom domain in front of the bucket for public reads (e.g. `media.bibowika.ph`)
4. Add the environment variables from the table below in Vercel
5. Add the same values as **GitHub repository secrets** for the transcode workflow — see
   [the workflow](.github/workflows/audio-transcode.yml)

Audio is **not** served from Vercel. R2 egress is free; Vercel Blob bills transfer separately from
your bandwidth allowance. A 48 kHz WAV master also exceeds Vercel's hard 4.5 MB function body limit,
which is why uploads go direct to R2 via a presigned URL.

---

## Environment variables

Set these in **Project → Settings → Environment Variables**.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Stage 2 | Set automatically by the Neon integration |
| `NUXT_DATABASE_URL` | Stage 2, manual only | Use instead of the above if connecting Neon by hand. Pooled string. |
| `NUXT_ADMIN_TOKEN` | Stage 3 | Bearer token for `/api/admin/*`. Must match the GitHub `ADMIN_TOKEN` secret exactly. |
| `NUXT_R2_ACCOUNT_ID` | Stage 3 | Cloudflare account ID |
| `NUXT_R2_BUCKET` | Stage 3 | `bibo-media` |
| `NUXT_R2_ACCESS_KEY_ID` | Stage 3 | From the R2 API token |
| `NUXT_R2_SECRET_ACCESS_KEY` | Stage 3 | Shown once at token creation |
| `NUXT_PUBLIC_MEDIA_BASE` | Stage 3 | Public read domain, no trailing slash |
| `NUXT_PUBLIC_DEV_TTS` | **never in production** | See below |

### `NUXT_PUBLIC_DEV_TTS` — leave it unset

This enables placeholder speech synthesis. There is no usable text-to-speech for Cebuano, Ilocano or
Hiligaynon, so it approximates all four languages with a Filipino voice, which is wrong. It exists so
exercise flows can be built before recordings land.

Do not set it in a production environment. If you set it for a preview so a reviewer can click
through, the lesson screen paints a visible "not a real recording" badge — that badge is the safety
net, not a decoration.

---

## Troubleshooting

**Deployment fails before the build starts.** Almost always the region: more regions in `vercel.json`
than your plan allows. Hobby gets one.

**Build fails on install.** Vercel honours the `packageManager` field. If it picks the wrong pnpm,
set the install command explicitly to `pnpm install --frozen-lockfile` in project settings. Make sure
`pnpm-lock.yaml` is committed.

**The app loads but the lesson says `content: authored files`.** The database is not connected. Check
that `DATABASE_URL` or `NUXT_DATABASE_URL` exists in the environment you actually deployed to
(Production and Preview are separate), and redeploy — environment variable changes do not apply to
an existing deployment.

**Lesson screen shows "Naku!" with a topic error.** The database is connected but empty: you ran
`db:migrate` but not `db:seed`, or you seeded a different branch.

**Everything is slow from the Philippines.** Region mismatch. Both the Vercel functions and the Neon
project must be in Singapore. Check both.

**`/api/admin/*` returns 401.** `NUXT_ADMIN_TOKEN` is unset, or does not match the bearer token you
are sending.

**`/api/admin/upload-url` returns 503.** R2 is not configured — all four `NUXT_R2_*` values must be
present.

---

## Known gaps before a real launch

- **No PWA icons.** `nuxt.config.ts` references `/icons/icon-192.png`, `icon-512.png` and
  `icon-maskable.png`, and `public/icons/` does not exist yet. The site works and the build succeeds,
  but those URLs 404 and the install prompt will not behave properly. Generate them before you ask
  anyone to install the app.
- **No recorded audio.** Every form is `status: pending`, so the app is silent.
- **`NUXT_ADMIN_TOKEN` is a shared bearer token**, not real auth. Fine for Phase 0, replaced by
  `nuxt-auth-utils` sessions in Phase 1.
- **The scheduled half of the transcode workflow only processes Tagalog** and will fail daily until
  R2 secrets exist. Comment the `schedule:` block out until Stage 3.
