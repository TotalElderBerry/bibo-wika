import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Kailangan ng database para sa mga profile ng bata' })
  }

  const parent = await requireParent(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Kailangan ang ID ng profile' })
  }

  const db = useDb()
  const [profile] = await db
    .select({
      id: schema.profiles.id,
      displayName: schema.profiles.displayName,
      band: schema.profiles.band,
      avatar: schema.profiles.avatar,
      activeLang: schema.profiles.activeLang,
      xp: schema.profiles.xp,
    })
    .from(schema.profiles)
    .where(and(eq(schema.profiles.id, id), eq(schema.profiles.parentId, parent.id)))
    .limit(1)

  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'Walang nahanap na profile ng bata' })
  }

  const progress = await db
    .select({
      conceptId: schema.progress.conceptId,
      lang: schema.progress.lang,
      box: schema.progress.box,
    })
    .from(schema.progress)
    .where(eq(schema.progress.profileId, id))

  return {
    profile,
    boxes: Object.fromEntries(progress.map((item) => [`${item.conceptId}:${item.lang}`, item.box])),
  }
})
