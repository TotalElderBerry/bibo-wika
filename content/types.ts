/**
 * The content model from spec section 05.
 *
 * Content is keyed by CONCEPT, never by word. One concept owns one picture and
 * one meaning; each language contributes a form. Adding a fifth language is a
 * data task, not an engineering task.
 */

export const LANGS = ['tl', 'ceb', 'ilo', 'hil'] as const
export type Lang = (typeof LANGS)[number]

export const LANG_META: Record<Lang, { name: string; endonym: string; guide: string }> = {
  tl: { name: 'Tagalog', endonym: 'Wikang Tagalog', guide: 'Tala' },
  ceb: { name: 'Cebuano', endonym: 'Binisaya', guide: 'Bisoy' },
  ilo: { name: 'Ilocano', endonym: 'Pagsasao nga Ilokano', guide: 'Inggo' },
  hil: { name: 'Hiligaynon', endonym: 'Ilonggo', guide: 'Ilyang' },
}

/**
 * Age bands.
 *
 * `usbong` (shoot) and `puno` (tree) are the two child bands the app was built
 * around. `matanda` is the adult band - the Dialect learning for adults track,
 * for someone learning the language their own family speaks.
 *
 * **`matanda` is announced, not built.** The band exists in the model and in
 * Postgres so content can be marked for it and a profile can carry it; there is
 * no adult entry point, no adult-paced exercise, and nothing filters a lesson by
 * band yet. Nothing in the app offers it to a person today.
 *
 * A naming note for whoever picks this up: `matanda` literally means "old", which
 * is a strange label for a 25-year-old learning their lola's Ilocano. It is one
 * enum value and one migration to rename while nothing depends on it.
 */
export const BANDS = ['usbong', 'puno', 'matanda'] as const
export type Band = (typeof BANDS)[number]

export const BAND_META: Record<Band, { name: string; ages: string; built: boolean }> = {
  usbong: { name: 'Usbong', ages: '4-7', built: true },
  puno: { name: 'Puno', ages: '8-12', built: true },
  matanda: { name: 'Matanda', ages: '13+', built: false },
}

/** Two-pass native-speaker review, spec section 12. Nothing ships at `pending`. */
export type AudioStatus = 'pending' | 'recorded' | 'approved'

export interface Form {
  /** The taught standard form for this language. */
  text: string
  /** Child-facing syllable respelling. Never IPA in the UI. */
  respell: string
  ipa?: string
  /**
   * Regional alternates. Always ACCEPTED as correct in exercises and surfaced
   * in Salita Sabayan as "your lola might say...". A child in Bohol who says
   * `ido` for Cebuano must not be marked wrong. Spec section 03.
   */
  variants?: string[]
  /** R2 object key. Audio never lives in Postgres. */
  audioKey?: string
  status: AudioStatus
}

export interface Concept {
  /** Stable dotted id, e.g. `animal.dog`. */
  id: string
  topic: string
  /** Which age modes this concept appears in. */
  bands: Band[]
  en: string
  /** Key into the built-in SVG art set. */
  art: string
  forms: Record<Lang, Form>
}

export interface Topic {
  slug: string
  en: string
  /** Per-language topic titles, shown above the lesson. */
  title: Record<Lang, string>
  art: string
  concepts: Concept[]
}
