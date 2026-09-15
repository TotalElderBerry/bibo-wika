import { and, eq, gt, lt } from 'drizzle-orm'
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
  // scrypt throws on keylen 0, which would turn a corrupt stored hash into a
  // 500 on login rather than a refused password. A hash we cannot parse is a
  // failed verification, not a server error.
  if (expected.length !== KEY_BYTES) return false

  const actual = (await scrypt(`${password}${cfgPepper()}`, salt, KEY_BYTES)) as Buffer
  return timingSafeEqual(actual, expected)
}

/**
 * Spend the same time on a login for an address with no account.
 *
 * Without this, an unknown email returns before any scrypt work happens and a
 * known one does not - a timing oracle for "does this family have an account
 * here", which is exactly the kind of thing not to leak about children.
 */
let decoy: Promise<string> | null = null

export async function burnPasswordTime(password: string) {
  decoy ??= hashPassword(randomUUID())
  await verifyPassword(password, await decoy)
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
  // Same attributes as setSessionCookie. A delete whose flags do not match the
  // cookie that was set is ignored by some browsers, which logs a parent out
  // of the UI while leaving a live session cookie on the device.
  deleteCookie(event, COOKIE, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function createParentSession(event: H3Event, parentId: string) {
  const db = useDb()
  const id = randomUUID()
  const expiresAt = sessionExpiry()

  await db.insert(schema.parentSessions).values({ id, parentId, expiresAt })

  // Rows here are never read again once they lapse, and a parent who signs in
  // from a new device every week accumulates them forever. Clearing this
  // account's dead sessions on the way in keeps the table proportional to
  // devices in use rather than to logins ever made.
  await db
    .delete(schema.parentSessions)
    .where(
      and(eq(schema.parentSessions.parentId, parentId), lt(schema.parentSessions.expiresAt, new Date())),
    )

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
    throw createError({ statusCode: 401, statusMessage: 'Kailangan ng login ng magulang' })
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
