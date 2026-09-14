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
 */
export interface UpcomingTopic {
  slug: string
  en: string
  title: Record<Lang, string>
}

export const upcoming: UpcomingTopic[] = [
  {
    slug: 'pagkain',
    en: 'Food',
    title: { tl: 'Pagkain', ceb: 'Pagkaon', ilo: 'Taraon', hil: 'Pagkaon' },
  },
  {
    slug: 'pamilya',
    en: 'Family',
    title: { tl: 'Pamilya', ceb: 'Pamilya', ilo: 'Pamilia', hil: 'Pamilya' },
  },
  {
    slug: 'kulay',
    en: 'Colours',
    title: { tl: 'Mga Kulay', ceb: 'Mga Kolor', ilo: 'Dagiti Maris', hil: 'Mga Kolor' },
  },
  {
    slug: 'bilang',
    en: 'Numbers',
    title: { tl: 'Mga Bilang', ceb: 'Mga Numero', ilo: 'Dagiti Numero', hil: 'Mga Numero' },
  },
  {
    slug: 'pagbati',
    en: 'Greetings',
    title: { tl: 'Pagbati', ceb: 'Pagtimbaya', ilo: 'Kablaaw', hil: 'Pagtamyaw' },
  },
]
