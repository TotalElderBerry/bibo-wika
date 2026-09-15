import type { Topic } from './types'

/**
 * Animals - topic 1 of 6, and the first one written.
 *
 * Eight concepts taken all the way through all four languages. This was the
 * vertical slice the rest of the curriculum was built on, so its eight were
 * chosen to exercise the whole range the content model has to survive:
 *
 *   - `animal.chicken`  identical in all four (manok)
 *   - `animal.bird`     four completely unrelated words
 *   - `animal.butterfly` near-cognates across Visayan and Ilocano
 *   - `animal.dog`      a Cebuano regional variant (Bohol: ido) that must be
 *                       accepted as correct
 *
 * A trap worth knowing: Cebuano `langgam` means BIRD. Tagalog `langgam` means
 * ANT. Same spelling, different animal. This is exactly the kind of thing a
 * word-keyed content model gets wrong and a concept-keyed one gets right.
 *
 * STATUS: every form is `pending`. No audio has been recorded. Nothing here
 * ships to a child until two native reviewers per language move it to
 * `approved` - spec section 12.
 */
export const hayop: Topic = {
  slug: 'hayop',
  en: 'Animals',
  art: 'dog',
  title: {
    tl: 'Mga Hayop',
    ceb: 'Mga Hayop',
    ilo: 'Dagiti Ayup',
    hil: 'Mga Sapat',
  },
  concepts: [
    {
      id: 'animal.dog',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'dog',
      art: 'dog',
      forms: {
        tl: { text: 'aso', respell: 'AH-soh', ipa: 'ˈʔa.so', status: 'pending' },
        ceb: { text: 'iro', respell: 'EE-roh', ipa: 'ˈʔi.ɾo', variants: ['ido'], status: 'pending' },
        ilo: { text: 'aso', respell: 'AH-soh', ipa: 'ˈʔa.so', status: 'pending' },
        hil: { text: 'ido', respell: 'EE-doh', ipa: 'ˈʔi.do', status: 'pending' },
      },
    },
    {
      id: 'animal.cat',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'cat',
      art: 'cat',
      forms: {
        tl: { text: 'pusa', respell: 'POO-sah', ipa: 'ˈpu.sa', status: 'pending' },
        ceb: { text: 'iring', respell: 'EE-ring', ipa: 'ˈʔi.ɾiŋ', status: 'pending' },
        ilo: { text: 'pusa', respell: 'POO-sah', ipa: 'ˈpu.sa', status: 'pending' },
        hil: { text: 'kuring', respell: 'KOO-ring', ipa: 'ˈku.ɾiŋ', status: 'pending' },
      },
    },
    {
      id: 'animal.chicken',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'chicken',
      art: 'chicken',
      forms: {
        tl: { text: 'manok', respell: 'ma-NOK', ipa: 'maˈnok', status: 'pending' },
        ceb: { text: 'manok', respell: 'ma-NOK', ipa: 'maˈnok', status: 'pending' },
        ilo: { text: 'manok', respell: 'ma-NOK', ipa: 'maˈnok', status: 'pending' },
        hil: { text: 'manok', respell: 'ma-NOK', ipa: 'maˈnok', status: 'pending' },
      },
    },
    {
      id: 'animal.fish',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'fish',
      art: 'fish',
      forms: {
        tl: { text: 'isda', respell: 'is-DAH', ipa: 'ʔisˈda', status: 'pending' },
        ceb: { text: 'isda', respell: 'is-DAH', ipa: 'ʔisˈda', status: 'pending' },
        ilo: { text: 'ikan', respell: 'EE-kan', ipa: 'ˈʔi.kan', status: 'pending' },
        hil: { text: 'isda', respell: 'is-DAH', ipa: 'ʔisˈda', status: 'pending' },
      },
    },
    {
      id: 'animal.bird',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'bird',
      art: 'bird',
      forms: {
        tl: { text: 'ibon', respell: 'EE-bon', ipa: 'ˈʔi.bon', status: 'pending' },
        ceb: { text: 'langgam', respell: 'LANG-gam', ipa: 'ˈlaŋ.gam', status: 'pending' },
        ilo: { text: 'billit', respell: 'BIL-lit', ipa: 'ˈbil.lit', status: 'pending' },
        hil: { text: 'pispis', respell: 'PIS-pis', ipa: 'ˈpis.pis', status: 'pending' },
      },
    },
    {
      id: 'animal.carabao',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'carabao',
      art: 'carabao',
      forms: {
        tl: { text: 'kalabaw', respell: 'ka-la-BAW', ipa: 'ka.laˈbaw', status: 'pending' },
        ceb: { text: 'kabaw', respell: 'KA-baw', ipa: 'ˈka.baw', status: 'pending' },
        ilo: { text: 'nuang', respell: 'NOO-ang', ipa: 'ˈnu.aŋ', status: 'pending' },
        hil: { text: 'karabaw', respell: 'ka-ra-BAW', ipa: 'ka.ɾaˈbaw', status: 'pending' },
      },
    },
    {
      id: 'animal.turtle',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'turtle',
      art: 'turtle',
      forms: {
        tl: { text: 'pagong', respell: 'pa-GONG', ipa: 'paˈgoŋ', status: 'pending' },
        ceb: { text: 'bao', respell: 'BAH-oh', ipa: 'ˈba.ʔo', status: 'pending' },
        ilo: { text: 'pag-ong', respell: 'pag-ONG', ipa: 'pagˈʔoŋ', status: 'pending' },
        hil: { text: 'bao', respell: 'BAH-oh', ipa: 'ˈba.ʔo', status: 'pending' },
      },
    },
    {
      id: 'animal.butterfly',
      topic: 'hayop',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'butterfly',
      art: 'butterfly',
      forms: {
        tl: { text: 'paruparo', respell: 'pa-ru-PA-ro', ipa: 'pa.ɾuˈpa.ɾo', variants: ['paro-paro'], status: 'pending' },
        ceb: { text: 'alibangbang', respell: 'a-li-BANG-bang', ipa: 'ʔa.liˈbaŋ.baŋ', status: 'pending' },
        ilo: { text: 'kulibangbang', respell: 'ku-li-BANG-bang', ipa: 'ku.liˈbaŋ.baŋ', status: 'pending' },
        hil: { text: 'alibangbang', respell: 'a-li-BANG-bang', ipa: 'ʔa.liˈbaŋ.baŋ', status: 'pending' },
      },
    },
  ],
}
