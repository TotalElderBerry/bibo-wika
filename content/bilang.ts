import type { Topic } from './types'

/**
 * Numbers 1-8.
 *
 * The clearest family-resemblance topic in the curriculum: every one of the
 * four languages inherited the same Proto-Austronesian numerals, so a child
 * meeting `tatlo / tulo / tallo / tatlo` on one Salita Sabayan card sees the
 * relationship without anyone having to explain it. That is the whole argument
 * for the four-column model in eight cards.
 *
 * Counted, not written: this is the Usbong (4-7) band, where the picture is
 * N objects and the answer is a spoken word. Numerals as WRITTEN symbols are a
 * Puno-band reading exercise and are not taught here.
 *
 * STATUS: every form is `pending`. Two native reviewers per language before
 * anything here is played to a child - spec section 12.
 */
export const bilang: Topic = {
  slug: 'bilang',
  en: 'Numbers',
  art: 'num-3',
  title: {
    tl: 'Mga Bilang',
    ceb: 'Mga Numero',
    ilo: 'Dagiti Numero',
    hil: 'Mga Numero',
  },
  concepts: [
    {
      id: 'number.one',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'one',
      art: 'num-1',
      forms: {
        tl: { text: 'isa', respell: 'i-SAH', ipa: 'ʔiˈsa', status: 'pending' },
        ceb: { text: 'usa', respell: 'OO-sah', ipa: 'ˈʔu.sa', status: 'pending' },
        ilo: { text: 'maysa', respell: 'may-SAH', ipa: 'majˈsa', status: 'pending' },
        hil: { text: 'isa', respell: 'i-SAH', ipa: 'ʔiˈsa', status: 'pending' },
      },
    },
    {
      id: 'number.two',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'two',
      art: 'num-2',
      forms: {
        tl: { text: 'dalawa', respell: 'da-la-WAH', ipa: 'da.laˈwa', status: 'pending' },
        ceb: { text: 'duha', respell: 'du-HAH', ipa: 'duˈha', status: 'pending' },
        ilo: { text: 'dua', respell: 'du-WAH', ipa: 'duˈwa', status: 'pending' },
        hil: { text: 'duha', respell: 'du-HAH', ipa: 'duˈha', status: 'pending' },
      },
    },
    {
      id: 'number.three',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'three',
      art: 'num-3',
      forms: {
        tl: { text: 'tatlo', respell: 'tat-LOH', ipa: 'tatˈlo', status: 'pending' },
        ceb: { text: 'tulo', respell: 'tu-LOH', ipa: 'tuˈlo', status: 'pending' },
        ilo: { text: 'tallo', respell: 'TAL-loh', ipa: 'ˈtal.lo', status: 'pending' },
        hil: { text: 'tatlo', respell: 'tat-LOH', ipa: 'tatˈlo', status: 'pending' },
      },
    },
    {
      id: 'number.four',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'four',
      art: 'num-4',
      forms: {
        tl: { text: 'apat', respell: 'AH-pat', ipa: 'ˈʔa.pat', status: 'pending' },
        ceb: { text: 'upat', respell: 'OO-pat', ipa: 'ˈʔu.pat', status: 'pending' },
        ilo: { text: 'uppat', respell: 'OOP-pat', ipa: 'ˈʔup.pat', status: 'pending' },
        hil: { text: 'apat', respell: 'AH-pat', ipa: 'ˈʔa.pat', status: 'pending' },
      },
    },
    {
      id: 'number.five',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'five',
      art: 'num-5',
      forms: {
        tl: { text: 'lima', respell: 'li-MAH', ipa: 'liˈma', status: 'pending' },
        ceb: { text: 'lima', respell: 'li-MAH', ipa: 'liˈma', status: 'pending' },
        ilo: { text: 'lima', respell: 'li-MAH', ipa: 'liˈma', status: 'pending' },
        hil: { text: 'lima', respell: 'li-MAH', ipa: 'liˈma', status: 'pending' },
      },
    },
    {
      id: 'number.six',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'six',
      art: 'num-6',
      forms: {
        tl: { text: 'anim', respell: 'AH-nim', ipa: 'ˈʔa.nim', status: 'pending' },
        ceb: { text: 'unom', respell: 'OO-nom', ipa: 'ˈʔu.nom', status: 'pending' },
        ilo: { text: 'innem', respell: 'IN-nem', ipa: 'ˈʔin.nem', status: 'pending' },
        hil: { text: 'anum', respell: 'AH-num', ipa: 'ˈʔa.num', status: 'pending' },
      },
    },
    {
      id: 'number.seven',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'seven',
      art: 'num-7',
      forms: {
        tl: { text: 'pito', respell: 'pi-TOH', ipa: 'piˈto', status: 'pending' },
        ceb: { text: 'pito', respell: 'pi-TOH', ipa: 'piˈto', status: 'pending' },
        ilo: { text: 'pito', respell: 'pi-TOH', ipa: 'piˈto', status: 'pending' },
        hil: { text: 'pito', respell: 'pi-TOH', ipa: 'piˈto', status: 'pending' },
      },
    },
    {
      id: 'number.eight',
      topic: 'bilang',
      bands: ['usbong', 'puno'],
      en: 'eight',
      art: 'num-8',
      forms: {
        tl: { text: 'walo', respell: 'wa-LOH', ipa: 'waˈlo', status: 'pending' },
        ceb: { text: 'walo', respell: 'wa-LOH', ipa: 'waˈlo', status: 'pending' },
        ilo: { text: 'walo', respell: 'WAH-loh', ipa: 'ˈwa.lo', status: 'pending' },
        hil: { text: 'walo', respell: 'wa-LOH', ipa: 'waˈlo', status: 'pending' },
      },
    },
  ],
}
