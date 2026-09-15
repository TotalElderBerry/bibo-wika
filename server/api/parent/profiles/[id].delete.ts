import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Database is required for child profiles' })
  }

  const parent = await requireParent(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Profile ID is required' })
  }

  const result = await useDb()
    .delete(schema.profiles)
    .where(and(eq(schema.profiles.id, id), eq(schema.profiles.parentId, parent.id)))
    .returning({ id: schema.profiles.id })

  if (!result.length) {
    throw createError({ statusCode: 404, statusMessage: 'Child profile not found' })
  }

  return { profileId: id, deleted: true }
})
