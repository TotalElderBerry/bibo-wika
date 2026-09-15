import { BANDS, LANGS, type Band, type Lang } from '~~/content/types'

/**
 * Shared validation for the three routes that accept a child profile.
 *
 * `profiles.post`, `profiles/[id].patch` and `profiles/link.post` each carried
 * their own copy of these sets. They had already drifted - the create route
 * accepted any string up to 40 characters as a buddy, so a profile could be
 * stored with a buddy the child app cannot draw, and it would silently become
 * Tikoy the moment the child opened it.
 */
/**
 * The Phase 0 roster, and the only values the child app can render. Kept in
 * step with `app/utils/buddies.ts` by hand: server code cannot import from
 * `app/`, and a wrong value here is caught by the test for it rather than by a
 * child seeing the wrong animal.
 */
export const BUDDY_IDS = ['tikoy', 'kalab', 'haribon', 'pawi', 'maya', 'sari'] as const
export type BuddyId = (typeof BUDDY_IDS)[number]

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value)
}

/**
 * Accepts `matanda` as well as the two child bands. Nothing offers the adult
 * band to a person yet - the parent dashboard shows it disabled - but the model
 * and the API agree on it, so authoring and profile data can move first.
 */
export function isBand(value: unknown): value is Band {
  return typeof value === 'string' && (BANDS as readonly string[]).includes(value)
}

export function isBuddy(value: unknown): value is BuddyId {
  return typeof value === 'string' && (BUDDY_IDS as readonly string[]).includes(value)
}

/** 2-80 characters after trimming. Long enough for a full name, short enough
    to render on a card. */
export function cleanChildName(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export function isChildName(value: string) {
  return value.length >= 2 && value.length <= 80
}
