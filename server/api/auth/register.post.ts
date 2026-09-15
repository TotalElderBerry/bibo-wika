import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Database is required for parent accounts' })
  }

  const body = await readBody<{
    displayName?: string
    email?: string
    password?: string
  }>(event)

  const displayName = body?.displayName?.trim() ?? ''
  const email = cleanAuthEmail(body?.email)
  const password = body?.password ?? ''

  if (displayName.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Name must be at least 2 characters' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 8 characters' })
  }

  const db = useDb()
  const [existing] = await db
    .select({ id: schema.parentAccounts.id })
    .from(schema.parentAccounts)
    .where(eq(schema.parentAccounts.email, email))
    .limit(1)

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'An account already exists for this email' })
  }

  const id = randomUUID()
  const passwordHash = await hashPassword(password)

  await db.insert(schema.parentAccounts).values({
    id,
    displayName,
    email,
    passwordHash,
  })

  await createParentSession(event, id)

  return {
    parent: publicParent({ id, displayName, email }),
  }
})
