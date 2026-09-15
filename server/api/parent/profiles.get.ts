import { eq, inArray, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Database is required for parent profiles' })
  }

  const parent = await requireParent(event)
  const db = useDb()
  const profiles = await db
    .select({
      id: schema.profiles.id,
      displayName: schema.profiles.displayName,
      band: schema.profiles.band,
      avatar: schema.profiles.avatar,
      activeLang: schema.profiles.activeLang,
      xp: schema.profiles.xp,
      createdAt: schema.profiles.createdAt,
    })
    .from(schema.profiles)
    .where(eq(schema.profiles.parentId, parent.id))

  if (!profiles.length) return { profiles: [] }

  const profileIds = profiles.map((profile) => profile.id)
  const progress = await db
    .select({
      profileId: schema.progress.profileId,
      practiced: sql<number>`count(*)`,
      mastered: sql<number>`count(*) filter (where ${schema.progress.box} >= 4)`,
      due: sql<number>`count(*) filter (where ${schema.progress.dueAt} <= now())`,
    })
    .from(schema.progress)
    .where(inArray(schema.progress.profileId, profileIds))
    .groupBy(schema.progress.profileId)

  const stats = new Map(progress.map((row) => [row.profileId, row]))

  return {
    profiles: profiles.map((profile) => {
      const row = stats.get(profile.id)
      return {
        ...profile,
        stats: {
          practiced: Number(row?.practiced ?? 0),
          mastered: Number(row?.mastered ?? 0),
          due: Number(row?.due ?? 0),
        },
      }
    }),
  }
})
