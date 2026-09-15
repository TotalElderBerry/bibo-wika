import { randomUUID } from 'node:crypto'

const LANGS = new Set(['tl', 'ceb', 'ilo', 'hil'])
const BANDS = new Set(['usbong', 'puno'])

interface CreateProfileBody {
  displayName?: string
  buddy?: string
  lang?: string
  band?: string
}

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Database is required for child profiles' })
  }

  const parent = await requireParent(event)
  const body = await readBody<CreateProfileBody>(event)
  const displayName = body?.displayName?.trim() ?? ''
  const buddy = body?.buddy?.trim() ?? 'bibo'
  const lang = body?.lang ?? 'tl'
  const band = body?.band ?? 'usbong'

  if (displayName.length < 2 || displayName.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Child name must be 2 to 80 characters' })
  }
  if (!buddy || buddy.length > 40) {
    throw createError({ statusCode: 400, statusMessage: 'A valid buddy is required' })
  }
  if (!LANGS.has(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported language' })
  }
  if (!BANDS.has(band)) {
    throw createError({ statusCode: 400, statusMessage: 'Unsupported learning band' })
  }

  const id = randomUUID()
  await useDb().insert(schema.profiles).values({
    id,
    parentId: parent.id,
    displayName,
    band: band as 'usbong' | 'puno',
    avatar: { buddy },
    activeLang: lang as 'tl' | 'ceb' | 'ilo' | 'hil',
  })

  return { profileId: id, created: true }
})
