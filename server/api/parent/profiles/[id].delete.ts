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

  const result = await useDb()
    .delete(schema.profiles)
    .where(and(eq(schema.profiles.id, id), eq(schema.profiles.parentId, parent.id)))
    .returning({ id: schema.profiles.id })

  if (!result.length) {
    throw createError({ statusCode: 404, statusMessage: 'Walang nahanap na profile ng bata' })
  }

  return { profileId: id, deleted: true }
})
