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

/**
 * Features announced but not built.
 *
 * Same contract as `upcoming` above: everything here is visible on the landing
 * page and nothing here is reachable. A feature leaves this list on the day it
 * becomes usable, not on the day it becomes half-usable.
 */
export interface UpcomingFeature {
  id: string
  /** Taglish. The landing page is the one screen written for an adult. */
  title: string
  blurb: string
  /** The named pieces. Every one of these is a thing that does not exist yet. */
  parts: Array<{ name: string; note: string }>
}

export const upcomingFeatures: UpcomingFeature[] = [
  {
    id: 'matanda',
    title: 'Para sa matatanda',
    blurb:
      'Ang parehong apat na wika, para sa mga nasa hustong gulang na gustong matutunan ang wika ng sariling pamilya - ang Ilocano ni lolo, ang Cebuano ni lola. Nasa modelo na ang antas na matanda at nakamarka na rito ang lahat ng 48 konsepto. Wala pang aralin na nakatutok sa matanda.',
    parts: [
      {
        name: 'Sariling account',
        note: 'Sariling login ang matandang nag-aaral - hindi profile sa ilalim ng account ng magulang. Gagamitin nito ang parehong account at session na umiiral na ngayon para sa mga magulang.',
      },
      {
        name: 'Mas malalim na aralin',
        note: 'Higit sa pakinggan-at-pindutin: pagbasa, pagbaybay, at buong pangungusap. Dalawa pa lang sa labing-isang uri ng ehersisyo ang nakagawa.',
      },
      {
        name: 'Sariling deck ng bokabularyo',
        note: 'Maiipon at maitatabi ang mga salitang gusto mong balikan. Ito ang tanging bahagi na wala pang puwesto sa database.',
      },
    ],
  },
]
