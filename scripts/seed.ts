/**
 * Pushes the authored content files into Neon.
 *
 * The files under `content/` are the source of truth that a curriculum lead
 * edits and reviews in a pull request; this script projects them into the
 * database the app and CMS read. Run after `pnpm db:migrate`.
 *
 *   pnpm db:seed
 */
import { readFileSync, existsSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { topics as contentTopics } from '../content/topics'
import { LANGS } from '../content/types'
import * as schema from '../server/db/schema'

// Minimal .env reader so the script works without a dotenv dependency.
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]!
    if (!process.env[key]) process.env[key] = m[2]!.replace(/^["']|["']$/g, '')
  }
}

const url = process.env.NUXT_DATABASE_URL || process.env.DATABASE_URL
if (!url) {
  console.error('\n  Set NUXT_DATABASE_URL (see .env.example) before seeding.\n')
  process.exit(1)
}

const db = drizzle(neon(url), { schema })

async function main() {
  let conceptCount = 0
  let formCount = 0

  for (const [ti, topic] of contentTopics.entries()) {
    await db
      .insert(schema.topics)
      .values({ slug: topic.slug, en: topic.en, art: topic.art, title: topic.title, ord: ti })
      .onConflictDoUpdate({
        target: schema.topics.slug,
        set: { en: topic.en, art: topic.art, title: topic.title, ord: ti },
      })

    for (const [ci, concept] of topic.concepts.entries()) {
      await db
        .insert(schema.concepts)
        .values({
          id: concept.id,
          topic: topic.slug,
          bands: concept.bands,
          en: concept.en,
          art: concept.art,
          ord: ci,
        })
        .onConflictDoUpdate({
          target: schema.concepts.id,
          set: { topic: topic.slug, bands: concept.bands, en: concept.en, art: concept.art, ord: ci },
        })
      conceptCount++

      for (const lang of LANGS) {
        const form = concept.forms[lang]
        await db
          .insert(schema.forms)
          .values({
            conceptId: concept.id,
            lang,
            text: form.text,
            respell: form.respell,
            ipa: form.ipa ?? null,
            variants: form.variants ?? [],
            status: form.status,
          })
          .onConflictDoUpdate({
            target: [schema.forms.conceptId, schema.forms.lang],
            set: {
              text: form.text,
              respell: form.respell,
              ipa: form.ipa ?? null,
              variants: form.variants ?? [],
              // `audioKey` and `status` are owned by the recording pipeline, not
              // by this file - seeding must never demote an approved clip.
              updatedAt: new Date(),
            },
          })
        formCount++
      }
    }
  }

  console.log(`\n  Seeded ${conceptCount} concepts and ${formCount} forms across ${LANGS.length} languages.\n`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
