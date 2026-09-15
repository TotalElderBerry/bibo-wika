import { randomUUID } from 'node:crypto'

interface CreateProfileBody {
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
  const body = await readBody<CreateProfileBody>(event)
  const displayName = cleanChildName(body?.displayName)
  const buddy = body?.buddy?.trim() ?? ''
  const lang = body?.lang ?? 'tl'
  const band = body?.band ?? 'usbong'

  if (!isChildName(displayName)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dapat 2 hanggang 80 letra ang pangalan ng bata',
    })
  }
  // Was: any string up to 40 characters. A buddy outside the roster is one the
  // child app cannot draw, and it became Tikoy without telling anyone.
  if (!isBuddy(buddy)) {
    throw createError({ statusCode: 400, statusMessage: 'Pumili ng kaibigan mula sa listahan' })
  }
  if (!isLang(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Hindi suportadong wika' })
  }
  if (!isBand(band)) {
    throw createError({ statusCode: 400, statusMessage: 'Hindi suportadong antas' })
  }

  const id = randomUUID()
  await useDb().insert(schema.profiles).values({
    id,
    parentId: parent.id,
    displayName,
    band,
    avatar: { buddy },
    activeLang: lang,
  })

  return { profileId: id, created: true }
})
