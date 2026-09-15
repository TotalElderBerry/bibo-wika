import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

/** Postgres 23505. Drizzle surfaces the driver error rather than typing it. */
function isUniqueViolation(err: unknown) {
  if (typeof err !== 'object' || !err) return false
  const code = (err as { code?: unknown }).code
  return code === '23505'
}

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Kailangan ng database para sa mga account ng magulang' })
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
    throw createError({ statusCode: 400, statusMessage: 'Dapat 2 letra o higit ang pangalan' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Maglagay ng tamang email address' })
  }
  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Dapat 8 letra o higit ang password' })
  }

  const db = useDb()
  const [existing] = await db
    .select({ id: schema.parentAccounts.id })
    .from(schema.parentAccounts)
    .where(eq(schema.parentAccounts.email, email))
    .limit(1)

  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'May account nang gumagamit ng email na ito' })
  }

  const id = randomUUID()
  const passwordHash = await hashPassword(password)

  // The check above is a courtesy, not a guarantee: two registrations for the
  // same address in the same moment both pass it, and the unique index is what
  // actually decides. Catching the violation turns the loser of that race into
  // the same 409 the courtesy check gives, rather than a 500.
  try {
    await db.insert(schema.parentAccounts).values({
      id,
      displayName,
      email,
      passwordHash,
    })
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw createError({ statusCode: 409, statusMessage: 'May account nang gumagamit ng email na ito' })
    }
    throw err
  }

  await createParentSession(event, id)

  return {
    parent: publicParent({ id, displayName, email }),
  }
})
