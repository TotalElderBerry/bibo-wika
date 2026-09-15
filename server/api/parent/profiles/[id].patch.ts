import { and, eq } from 'drizzle-orm'

interface UpdateProfileBody {
  displayName?: string
  buddy?: string
  lang?: string
  band?: string
}

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Kailangan ng database para sa mga profile ng bata',
    })
  }

  const parent = await requireParent(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateProfileBody>(event)
  const displayName = cleanChildName(body?.displayName)
  const buddy = body?.buddy?.trim() ?? ''
  const lang = body?.lang ?? ''
  const band = body?.band ?? ''

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Kailangan ang ID ng profile' })
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
  if (!isLang(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Hindi suportadong wika' })
  }
  if (!isBand(band)) {
    throw createError({ statusCode: 400, statusMessage: 'Hindi suportadong antas' })
  }

  // The parent filter in the WHERE is the authorisation check: a profile owned
  // by someone else matches nothing and comes back as a 404, which is also the
  // right answer to give - it does not confirm the id exists.
  const result = await useDb()
    .update(schema.profiles)
    .set({
      displayName,
      avatar: { buddy },
      activeLang: lang,
      band,
    })
    .where(and(eq(schema.profiles.id, id), eq(schema.profiles.parentId, parent.id)))
    .returning({ id: schema.profiles.id })

  if (!result[0]) {
    throw createError({ statusCode: 404, statusMessage: 'Walang nahanap na profile ng bata' })
  }

  return { profileId: id, updated: true }
})
