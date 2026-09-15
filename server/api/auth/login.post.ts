import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Database is required for parent login' })
  }

  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = cleanAuthEmail(body?.email)
  const password = body?.password ?? ''

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const [parent] = await useDb()
    .select({
      id: schema.parentAccounts.id,
      displayName: schema.parentAccounts.displayName,
      email: schema.parentAccounts.email,
      passwordHash: schema.parentAccounts.passwordHash,
    })
    .from(schema.parentAccounts)
    .where(eq(schema.parentAccounts.email, email))
    .limit(1)

  if (!parent || !(await verifyPassword(password, parent.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Email or password is incorrect' })
  }

  await createParentSession(event, parent.id)

  return {
    parent: publicParent(parent),
  }
})
