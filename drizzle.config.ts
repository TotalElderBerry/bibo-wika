import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    // Use the POOLED (-pooler) Neon connection string.
    url: (process.env.DATABASE_URL ?? process.env.NUXT_DATABASE_URL)!,
  },
  verbose: true,
  strict: true,
})
