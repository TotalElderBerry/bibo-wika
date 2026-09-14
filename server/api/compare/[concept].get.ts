import { eq } from 'drizzle-orm'
import { LANGS } from '~~/content/types'
import { topics as localTopics } from '~~/content/hayop'

/**
 * Salita Sabayan - one concept in all four languages at once.
 *
 * This is the mechanic no general-purpose language app has, and the reason the
 * content model is keyed by concept rather than by word. Spec section 01.
 */
export default defineEventHandler(async (event) => {
  const conceptId = getRouterParam(event, 'concept')!

  if (!hasDb()) {
    for (const t of localTopics) {
      const c = t.concepts.find((x) => x.id === conceptId)
      if (!c) continue
      return {
        conceptId: c.id,
        en: c.en,
        art: c.art,
        forms: LANGS.map((l) => ({
          lang: l,
          text: c.forms[l].text,
          respell: c.forms[l].respell,
          variants: c.forms[l].variants ?? [],
          status: c.forms[l].status,
        })),
      }
    }
    throw createError({ statusCode: 404, statusMessage: 'Unknown concept' })
  }

  const db = useDb()
  const [concept] = await db
    .select()
    .from(schema.concepts)
    .where(eq(schema.concepts.id, conceptId))
    .limit(1)

  if (!concept) throw createError({ statusCode: 404, statusMessage: 'Unknown concept' })

  const rows = await db.select().from(schema.forms).where(eq(schema.forms.conceptId, conceptId))
  const byLang = new Map(rows.map((r) => [r.lang, r]))

  return {
    conceptId: concept.id,
    en: concept.en,
    art: concept.art,
    forms: LANGS.map((l) => {
      const f = byLang.get(l)
      return {
        lang: l,
        text: f?.text ?? '',
        respell: f?.respell ?? '',
        variants: f?.variants ?? [],
        status: f?.status ?? 'pending',
      }
    }),
  }
})
