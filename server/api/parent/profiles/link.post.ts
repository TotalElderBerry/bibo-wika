import { eq, inArray, sql } from 'drizzle-orm'

/** A device that has played every concept in every language has 192 entries. */
const MAX_BOXES = 2000

interface LinkBody {
  id?: string
  displayName?: string
  buddy?: string
  lang?: string | null
  band?: string
  xp?: number
  boxes?: Record<string, unknown>
}

function isProfileId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f-]{36}$/i.test(value)
}

/**
 * Attach the profile living on this device to the signed-in parent account.
 *
 * The child keeps playing locally either way; this only gives the parent a
 * copy to look at. Two rules make that safe to run twice, which matters
 * because a parent who taps the button again should not lose anything:
 *
 *   - An already-linked profile keeps the name, buddy, language and band the
 *     parent set in the dashboard. The device does not own those fields once
 *     an adult has edited them, and re-linking used to overwrite them with
 *     whatever the device had.
 *   - Progress merges upward. A box only ever moves up and `seen` is never
 *     reset, so linking an old phone cannot demote what a newer device has
 *     already taught.
 */
export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Kailangan ng database para mag-link ng profile' })
  }

  const parent = await requireParent(event)
  const body = await readBody<LinkBody>(event)
  const id = body?.id
  const displayName = cleanChildName(body?.displayName)
  const buddy = body?.buddy?.trim() ?? ''
  const lang = body?.lang ?? null
  const band = body?.band ?? 'usbong'
  const xp = Number.isInteger(body?.xp) && body.xp! >= 0 ? body.xp! : 0

  if (!isProfileId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Kailangan ng wastong profile sa device na ito' })
  }
  if (!isChildName(displayName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dapat 2 hanggang 80 letra ang pangalan ng bata',
    })
  }
  if (!isBuddy(buddy)) {
    throw createError({ statusCode: 400, statusMessage: 'Pumili ng kaibigan mula sa listahan' })
  }
  if (lang !== null && !isLang(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Hindi suportadong wika' })
  }
  if (!isBand(band)) {
    throw createError({ statusCode: 400, statusMessage: 'Hindi suportadong antas' })
  }

  const db = useDb()
  const [existing] = await db
    .select({ parentId: schema.profiles.parentId, xp: schema.profiles.xp })
    .from(schema.profiles)
    .where(eq(schema.profiles.id, id))
    .limit(1)

  // A row owned by somebody else is never adopted. A row owned by nobody is -
  // `profiles.parent_id` is ON DELETE SET NULL, so a family who closed their
  // account and opened a new one would otherwise be locked out of the profile
  // still sitting on their own device. The id is a v4 UUID that exists only on
  // that device, so holding it is the proof of ownership.
  if (existing && existing.parentId && existing.parentId !== parent.id) {
    throw createError({ statusCode: 409, statusMessage: 'Nakatali na ang profile na ito sa ibang account' })
  }

  if (existing) {
    // Dashboard-owned fields are deliberately absent here.
    await db
      .update(schema.profiles)
      .set({ parentId: parent.id, xp: Math.max(existing.xp, xp) })
      .where(eq(schema.profiles.id, id))
  } else {
    await db.insert(schema.profiles).values({
      id,
      parentId: parent.id,
      displayName,
      band,
      avatar: { buddy },
      activeLang: lang ?? 'tl',
      xp,
    })
  }

  const candidates = Object.entries(body?.boxes ?? {})
    .slice(0, MAX_BOXES)
    .map(([key, value]) => {
      const separator = key.lastIndexOf(':')
      const conceptId = key.slice(0, separator)
      const conceptLang = key.slice(separator + 1)
      const box = Number(value)
      return { conceptId, lang: conceptLang, box }
    })
    .filter(
      (item) =>
        item.conceptId.length > 0 &&
        isLang(item.lang) &&
        Number.isInteger(item.box) &&
        item.box >= 1 &&
        item.box <= 5,
    )

  let merged = 0

  if (candidates.length) {
    const concepts = await db
      .select({ id: schema.concepts.id })
      .from(schema.concepts)
      .where(inArray(schema.concepts.id, candidates.map((item) => item.conceptId)))
    const knownConcepts = new Set(concepts.map((concept) => concept.id))

    const rows = candidates
      .filter((candidate) => knownConcepts.has(candidate.conceptId))
      .map((item) => ({
        profileId: id,
        conceptId: item.conceptId,
        lang: item.lang,
        box: item.box,
        seen: 1,
      }))

    // One statement, not one per concept. This used to await inside a loop,
    // which on a full device is ~190 sequential HTTPS round trips to Neon -
    // slow from a laptop and a timeout from a phone in Quezon City.
    if (rows.length) {
      await db
        .insert(schema.progress)
        .values(rows)
        .onConflictDoUpdate({
          target: [schema.progress.profileId, schema.progress.conceptId, schema.progress.lang],
          set: {
            box: sql`greatest(${schema.progress.box}, excluded.box)`,
            seen: sql`greatest(${schema.progress.seen}, 1)`,
          },
        })
      merged = rows.length
    }
  }

  return { profileId: id, linked: true, merged }
})
