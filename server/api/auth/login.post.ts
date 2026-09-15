import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  if (!hasDb()) {
    throw createError({ statusCode: 503, statusMessage: 'Kailangan ng database para sa login ng magulang' })
  }

  const body = await readBody<{ email?: string; password?: string }>(event)
  const email = cleanAuthEmail(body?.email)
  const password = body?.password ?? ''

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Kailangan ang email at password' })
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

  if (!parent) {
    // Spend the same time as a real verification before refusing. See
    // burnPasswordTime - a fast "no" here tells an attacker which family
    // addresses have accounts.
    await burnPasswordTime(password)
    throw createError({ statusCode: 401, statusMessage: 'Mali ang email o password' })
  }

  if (!(await verifyPassword(password, parent.passwordHash))) {
    throw createError({ statusCode: 401, statusMessage: 'Mali ang email o password' })
  }

  await createParentSession(event, parent.id)

  return {
    parent: publicParent(parent),
  }
})
