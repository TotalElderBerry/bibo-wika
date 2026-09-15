import { and, eq, gt } from 'drizzle-orm'
import { randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import type { H3Event } from 'h3'

const scrypt = promisify(scryptCb)
const COOKIE = 'bibo_parent_session'
const SESSION_DAYS = 30
const KEY_BYTES = 64

interface AuthParent {
  id: string
  displayName: string
  email: string
}

function cfgPepper() {
  return useRuntimeConfig().authPepper || process.env.NUXT_AUTH_PEPPER || ''
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function cleanAuthEmail(email: unknown) {
  if (typeof email !== 'string') return ''
  return normalizeEmail(email)
}

export function publicParent(parent: AuthParent) {
  return {
    id: parent.id,
    displayName: parent.displayName,
    email: parent.email,
  }
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url')
  const derived = (await scrypt(`${password}${cfgPepper()}`, salt, KEY_BYTES)) as Buffer
  return `scrypt:${salt}:${derived.toString('base64url')}`
}

export async function verifyPassword(password: string, encoded: string) {
  const [method, salt, hash] = encoded.split(':')
  if (method !== 'scrypt' || !salt || !hash) return false

  const expected = Buffer.from(hash, 'base64url')
  const actual = (await scrypt(`${password}${cfgPepper()}`, salt, expected.length)) as Buffer
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function sessionExpiry() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
}

export function setSessionCookie(event: H3Event, sessionId: string, expires: Date) {
  setCookie(event, COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, COOKIE, { path: '/' })
}

export async function createParentSession(event: H3Event, parentId: string) {
  const db = useDb()
  const id = randomUUID()
  const expiresAt = sessionExpiry()

  await db.insert(schema.parentSessions).values({ id, parentId, expiresAt })
  setSessionCookie(event, id, expiresAt)

  return id
}

export async function getCurrentParent(event: H3Event) {
  const sessionId = getCookie(event, COOKIE)
  if (!sessionId || !hasDb()) return null

  const db = useDb()
  const [row] = await db
    .select({
      sessionId: schema.parentSessions.id,
      parentId: schema.parentAccounts.id,
      displayName: schema.parentAccounts.displayName,
      email: schema.parentAccounts.email,
    })
    .from(schema.parentSessions)
    .innerJoin(schema.parentAccounts, eq(schema.parentAccounts.id, schema.parentSessions.parentId))
    .where(and(eq(schema.parentSessions.id, sessionId), gt(schema.parentSessions.expiresAt, new Date())))
    .limit(1)

  if (!row) return null

  return publicParent({
    id: row.parentId,
    displayName: row.displayName,
    email: row.email,
  })
}

export async function requireParent(event: H3Event) {
  const parent = await getCurrentParent(event)
  if (!parent) {
    throw createError({ statusCode: 401, statusMessage: 'Parent login required' })
  }
  return parent
}

export async function destroyParentSession(event: H3Event) {
  const sessionId = getCookie(event, COOKIE)
  clearSessionCookie(event)

  if (!sessionId || !hasDb()) return
  await useDb().delete(schema.parentSessions).where(eq(schema.parentSessions.id, sessionId))
}

export { normalizeEmail }
