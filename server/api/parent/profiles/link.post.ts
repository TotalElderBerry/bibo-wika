import { eq, inArray } from 'drizzle-orm'

const LANGS = new Set(['tl', 'ceb', 'ilo', 'hil'])
const BANDS = new Set(['usbong', 'puno'])

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

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Database is required to link a profile' })
  }

  const parent = await requireParent(event)
  const body = await readBody<LinkBody>(event)
  const id = body?.id
  const displayName = body?.displayName?.trim() ?? ''
  const buddy = body?.buddy?.trim() ?? ''
  const lang = body?.lang ?? null
  const band = body?.band ?? 'usbong'
  const xp = Number.isInteger(body?.xp) && body.xp! >= 0 ? body.xp! : 0

  if (!isProfileId(id)) {
    throw createError({ statusCode: 400, statusMessage: 'A valid local profile is required' })
  }
  if (displayName.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Child name must be at least 2 characters' })
  }
  if (!buddy || buddy.length > 40) {
    throw createError({ statusCode: 400, statusMessage: 'A child buddy is required' })
  }
  if (lang !== null && !LANGS.has(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported language' })
  }
  if (!BANDS.has(band)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported learning band' })
  }

  const db = useDb()
  const [existing] = await db
    .select({ parentId: schema.profiles.parentId })
    .from(schema.profiles)
    .where(eq(schema.profiles.id, id))
    .limit(1)

  if (existing?.parentId && existing.parentId !== parent.id) {
    throw createError({ statusCode: 409, statusMessage: 'This child profile belongs to another account' })
  }

  const profile = {
    id,
    parentId: parent.id,
    displayName,
    band: band as 'usbong' | 'puno',
    avatar: { buddy },
    activeLang: (lang ?? 'tl') as 'tl' | 'ceb' | 'ilo' | 'hil',
    xp,
  }

  if (existing) {
    await db.update(schema.profiles).set(profile).where(eq(schema.profiles.id, id))
  } else {
    await db.insert(schema.profiles).values(profile)
  }

  const candidates = Object.entries(body?.boxes ?? {})
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
        LANGS.has(item.lang) &&
        Number.isInteger(item.box) &&
        item.box >= 1 &&
        item.box <= 5,
    )

  if (candidates.length) {
    const concepts = await db
      .select({ id: schema.concepts.id })
      .from(schema.concepts)
      .where(inArray(schema.concepts.id, candidates.map((item) => item.conceptId)))
    const knownConcepts = new Set(concepts.map((concept) => concept.id))

    for (const item of candidates.filter((candidate) => knownConcepts.has(candidate.conceptId))) {
      await db
        .insert(schema.progress)
        .values({
          profileId: id,
          conceptId: item.conceptId,
          lang: item.lang as 'tl' | 'ceb' | 'ilo' | 'hil',
          box: item.box,
          seen: 1,
        })
        .onConflictDoUpdate({
          target: [schema.progress.profileId, schema.progress.conceptId, schema.progress.lang],
          set: { box: item.box, seen: 1 },
        })
    }
  }

  return { profileId: id, linked: true }
})
