import { AwsClient } from 'aws4fetch'
import { LANGS, type Lang } from '~~/content/types'

/**
 * Issues a short-lived presigned PUT so the CMS can upload a recording
 * DIRECTLY to Cloudflare R2.
 *
 * This indirection is not a style choice. A Vercel Function's request body is
 * capped at 4.5 MB at the infrastructure level - no config bypasses it - and a
 * 48 kHz WAV master is bigger than that. The function issues a URL and records
 * metadata; the bytes never touch Vercel. Spec section 10, constraint 1.
 *
 * Phase 0 auth is a shared bearer token. Phase 1 replaces it with
 * nuxt-auth-utils sessions and a real admin role.
 */
export default defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig()

  const auth = getHeader(event, 'authorization')
  if (!cfg.adminToken || auth !== `Bearer ${cfg.adminToken}`) {
    throw createError({ statusCode: 401, statusMessage: 'Admin token required' })
  }

  const body = await readBody<{ conceptId?: string; lang?: Lang; ext?: string }>(event)
  const { conceptId, lang } = body ?? {}
  const ext = body?.ext ?? 'wav'

  if (!conceptId || !/^[a-z0-9.]+$/.test(conceptId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid conceptId' })
  }
  if (!lang || !LANGS.includes(lang)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid lang' })
  }
  if (!['wav', 'flac'].includes(ext)) {
    throw createError({ statusCode: 400, statusMessage: 'Masters must be wav or flac' })
  }

  const { accountId, bucket, accessKeyId, secretAccessKey } = cfg.r2
  if (!accountId || !bucket || !accessKeyId || !secretAccessKey) {
    throw createError({ statusCode: 503, statusMessage: 'R2 is not configured' })
  }

  // Masters land in `incoming/`, which is what the transcode workflow watches.
  // It writes the normalised Opus derivative to `audio/<lang>/<conceptId>.opus`.
  const key = `incoming/${lang}/${conceptId}.${ext}`
  const endpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${key}`

  const client = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' })
  const signed = await client.sign(new Request(endpoint, { method: 'PUT' }), {
    aws: { signQuery: true },
    headers: { 'x-amz-expires': '900' },
  })

  return {
    uploadUrl: signed.url,
    key,
    expiresIn: 900,
    /** Where the derivative will appear once the transcode action has run. */
    publicUrl: `${cfg.public.mediaBase}/audio/${lang}/${conceptId}.opus`,
  }
})
