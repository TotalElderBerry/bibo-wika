import type { Lang } from './types'

/**
 * Topics that are PLANNED but not yet authored.
 *
 * These are shown on the home screen, locked and dimmed. Spec section 07:
 * "Locked topics stay visible and dimmed. Children need to see where they are
 * going; hiding future content removes the reason to continue."
 *
 * Nothing here is playable and nothing here claims to be. The moment a topic
 * gets a real content file it moves out of this list and into `topics`.
 *
 * The list is EMPTY right now, and that is the correct state rather than an
 * oversight: the five topics that used to sit here - pagkain, pamilya, kulay,
 * bilang and pagbati - have all been authored and now live in
 * `content/topics.ts`. Every screen that renders this list hides its section
 * when the list is empty, so nothing shows an empty "coming soon" shelf.
 *
 * Adding the next one is: put it here to announce it, author
 * `content/<slug>.ts`, then move it into the registry.
 */
export interface UpcomingTopic {
  slug: string
  en: string
  title: Record<Lang, string>
}

export const upcoming: UpcomingTopic[] = []
