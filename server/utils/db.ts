import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

export { schema }

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

/**
 * Neon over HTTP, not TCP.
 *
 * One HTTPS request per query means there is no connection pool to exhaust
 * when Vercel spins up N function instances at once. Always point
 * DATABASE_URL at the POOLED (-pooler) Neon host.
 */
export function useDb() {
  if (_db) return _db
  const url = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL
  if (!url) {
    throw createError({
      statusCode: 503,
      statusMessage:
        'No database configured. Set NUXT_DATABASE_URL, or run with the local content pack (see README).',
    })
  }
  _db = drizzle(neon(url), { schema })
  return _db
}

/** True when the app can talk to Neon. Lets routes fall back to local content. */
export function hasDb() {
  return Boolean(useRuntimeConfig().databaseUrl || process.env.DATABASE_URL)
}
