import { asc, eq } from 'drizzle-orm'
import { LANGS, type Lang } from '~~/content/types'
import { topics as localTopics } from '~~/content/hayop'

/**
 * A language pack: everything the child app needs for one language, as one
 * immutable versioned document the service worker can cache whole.
 *
 * Reads from Neon when a database is configured. Falls back to the authored
 * content files otherwise, so `pnpm dev` is playable on a fresh clone with no
 * DATABASE_URL - which matters for the content team, who should not need a
 * database to see their words in the app.
 */
export default defineCachedEventHandler(
  async (event) => {
    const lang = getRouterParam(event, 'lang') as Lang
    if (!LANGS.includes(lang)) {
      throw createError({ statusCode: 404, statusMessage: `Unknown language: ${lang}` })
    }

    if (!hasDb()) return buildFromLocal(lang)

    const db = useDb()
    const rows = await db
      .select({
        topicSlug: schema.topics.slug,
        topicTitle: schema.topics.title,
        topicArt: schema.topics.art,
        conceptId: schema.concepts.id,
        en: schema.concepts.en,
        art: schema.concepts.art,
        ord: schema.concepts.ord,
        text: schema.forms.text,
        respell: schema.forms.respell,
        variants: schema.forms.variants,
        status: schema.forms.status,
      })
      .from(schema.forms)
      .innerJoin(schema.concepts, eq(schema.concepts.id, schema.forms.conceptId))
      .innerJoin(schema.topics, eq(schema.topics.slug, schema.concepts.topic))
      .where(eq(schema.forms.lang, lang))
      .orderBy(asc(schema.topics.ord), asc(schema.concepts.ord))

    const byTopic = new Map<string, any>()
    for (const r of rows) {
      let t = byTopic.get(r.topicSlug)
      if (!t) {
        t = {
          slug: r.topicSlug,
          title: (r.topicTitle as Record<string, string>)[lang] ?? r.topicSlug,
          art: r.topicArt,
          concepts: [],
        }
        byTopic.set(r.topicSlug, t)
      }
      t.concepts.push({
        id: r.conceptId,
        en: r.en,
        art: r.art,
        text: r.text,
        respell: r.respell,
        variants: r.variants ?? [],
        status: r.status,
      })
    }

    return pack(lang, [...byTopic.values()])
  },
  {
    // Packs are versioned and immutable; a content release is a new version.
    maxAge: 60 * 60,
    name: 'lang-pack',
    getKey: (event) => getRouterParam(event, 'lang') ?? 'tl',
  },
)

function buildFromLocal(lang: Lang) {
  return pack(
    lang,
    localTopics.map((t) => ({
      slug: t.slug,
      title: t.title[lang],
      art: t.art,
      concepts: t.concepts.map((c) => ({
        id: c.id,
        en: c.en,
        art: c.art,
        text: c.forms[lang].text,
        respell: c.forms[lang].respell,
        variants: c.forms[lang].variants ?? [],
        status: c.forms[lang].status,
      })),
    })),
  )
}

function pack(lang: Lang, topics: unknown[]) {
  return {
    version: `${lang}-${new Date().toISOString().slice(0, 10)}`,
    lang,
    source: hasDb() ? 'neon' : 'local-content',
    topics,
  }
}
