import { and, eq } from 'drizzle-orm'

const LANGS = new Set(['tl', 'ceb', 'ilo', 'hil'])
const BANDS = new Set(['usbong', 'puno'])

interface UpdateProfileBody {
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
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateProfileBody>(event)
  const displayName = body?.displayName?.trim() ?? ''
  const buddy = body?.buddy?.trim() ?? ''
  const lang = body?.lang ?? ''
  const band = body?.band ?? ''

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Profile ID is required' })
  }
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

  const result = await useDb()
    .update(schema.profiles)
    .set({
      displayName,
      avatar: { buddy },
      activeLang: lang as 'tl' | 'ceb' | 'ilo' | 'hil',
      band: band as 'usbong' | 'puno',
    })
    .where(and(eq(schema.profiles.id, id), eq(schema.profiles.parentId, parent.id)))
    .returning({ id: schema.profiles.id })

  const profile = result[0]
  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Child profile not found' })
  }

  return { profileId: id, updated: true }
})
