import { and, eq, inArray } from 'drizzle-orm'
import { LANGS, type Lang } from '~~/content/types'

/**
 * Called by the transcode workflow once derivatives are in R2.
 *
 * Moves forms from `pending` to `recorded` and records the object key. It
 * deliberately stops there: only a human moves a clip to `approved`, and it
 * takes two of them - one for pronunciation, one for technical quality.
 * Spec section 12.
 */
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()

  const auth = getHeader(event, 'authorization')
  if (!cfg.adminToken || auth !== `Bearer ${cfg.adminToken}`) {
    throw createError({ statusCode: 401, statusMessage: 'Admin token required' })
  }

  const body = await readBody<{ lang?: Lang; conceptIds?: string | string[] }>(event)
  const lang = body?.lang
  if (!lang || !LANGS.includes(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lang' })
  }

  const ids = (
    Array.isArray(body?.conceptIds) ? body.conceptIds : String(body?.conceptIds ?? '').split(',')
  )
    .map((s) => s.trim())
    .filter(Boolean)

  if (!ids.length) return { updated: 0 }

  const db = useDb()
  const updated = await db
    .update(schema.forms)
    .set({ status: 'recorded', updatedAt: new Date() })
    .where(
      and(
        eq(schema.forms.lang, lang),
        inArray(schema.forms.conceptId, ids),
        // Never demote something a reviewer has already approved.
        eq(schema.forms.status, 'pending'),
      ),
    )
    .returning({ conceptId: schema.forms.conceptId })

  return { updated: updated.length, conceptIds: updated.map((u) => u.conceptId) }
})
