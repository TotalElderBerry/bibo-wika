import type { Lang } from '~~/content/types'

export interface PackConcept {
  id: string
  en: string
  art: string
  text: string
  respell: string
  variants: string[]
  status: 'pending' | 'recorded' | 'approved'
}

export interface PackTopic {
  slug: string
  title: string
  art: string
  concepts: PackConcept[]
}

export interface Pack {
  version: string
  lang: Lang
  source: 'neon' | 'local-content'
  topics: PackTopic[]
}

export interface CompareForm {
  lang: Lang
  text: string
  respell: string
  variants: string[]
  status: string
}

export interface Compare {
  conceptId: string
  en: string
  art: string
  forms: CompareForm[]
}

/**
 * Fetch once, then the service worker serves it offline.
 *
 * The `v` is the content fingerprint from `nuxt.config.ts`. It is what makes
 * the year-long `immutable` header on this route safe: a content release
 * changes the fingerprint, which changes the URL, which is the only thing a
 * browser will re-request once it has been told a response never changes.
 */
export function fetchPack(lang: Lang) {
  const { contentVersion } = useRuntimeConfig().public
  return $fetch<Pack>(`/api/pack/${lang}`, { query: { v: contentVersion } })
}

export function fetchCompare(conceptId: string) {
  return $fetch<Compare>(`/api/compare/${conceptId}`)
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}
