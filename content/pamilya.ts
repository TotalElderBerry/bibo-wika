import type { Topic } from './types'

/**
 * Family.
 *
 * The topic closest to why this app exists. A child with a Cebuano lola and an
 * Ilocano lolo hears `nanay`, `nanang` and `iloy` from three different adults
 * about the same person, and no general-purpose language app will ever put
 * those three words on one card.
 *
 * Two things worth knowing before editing this file:
 *
 *   - `family.sibling` splits four ways - `kapatid / igsoon / kabsat / utod`.
 *     It is the strongest four-way contrast in the whole curriculum.
 *   - The `variants` here are not regionalisms so much as REGISTERS. Tagalog
 *     `ina` and Cebuano `inahan` are the formal words a child meets in a
 *     schoolbook; `nanay` is what they actually say at home. The taught form is
 *     the spoken one, and the formal word is accepted rather than corrected.
 *
 * Art note: eight human figures are harder to tell apart at 72px than eight
 * animals. The drawings lean hard on one distinguishing feature each (bun,
 * moustache, blanket, two figures) rather than on faces.
 *
 * STATUS: every form is `pending` - spec section 12.
 */
export const pamilya: Topic = {
  slug: 'pamilya',
  en: 'Family',
  art: 'mother',
  title: {
    tl: 'Pamilya',
    ceb: 'Pamilya',
    ilo: 'Pamilia',
    hil: 'Pamilya',
  },
  concepts: [
    {
      id: 'family.mother',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'mother',
      art: 'mother',
      forms: {
        tl: { text: 'nanay', respell: 'NA-nay', ipa: 'ˈna.naj', variants: ['ina', 'mama'], status: 'pending' },
        ceb: { text: 'nanay', respell: 'NA-nay', ipa: 'ˈna.naj', variants: ['inahan', 'mama'], status: 'pending' },
        ilo: { text: 'nanang', respell: 'NA-nang', ipa: 'ˈna.naŋ', variants: ['ina'], status: 'pending' },
        hil: { text: 'nanay', respell: 'NA-nay', ipa: 'ˈna.naj', variants: ['iloy'], status: 'pending' },
      },
    },
    {
      id: 'family.father',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'father',
      art: 'father',
      forms: {
        tl: { text: 'tatay', respell: 'TA-tay', ipa: 'ˈta.taj', variants: ['ama', 'papa'], status: 'pending' },
        ceb: { text: 'tatay', respell: 'TA-tay', ipa: 'ˈta.taj', variants: ['amahan', 'papa'], status: 'pending' },
        ilo: { text: 'tatang', respell: 'TA-tang', ipa: 'ˈta.taŋ', variants: ['ama'], status: 'pending' },
        hil: { text: 'tatay', respell: 'TA-tay', ipa: 'ˈta.taj', variants: ['amay'], status: 'pending' },
      },
    },
    {
      id: 'family.child',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'child',
      art: 'child',
      forms: {
        tl: { text: 'anak', respell: 'a-NAK', ipa: 'ʔaˈnak', status: 'pending' },
        ceb: { text: 'anak', respell: 'a-NAK', ipa: 'ʔaˈnak', status: 'pending' },
        ilo: { text: 'anak', respell: 'a-NAK', ipa: 'ʔaˈnak', status: 'pending' },
        hil: { text: 'anak', respell: 'a-NAK', ipa: 'ʔaˈnak', status: 'pending' },
      },
    },
    {
      id: 'family.baby',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'baby',
      art: 'baby',
      forms: {
        tl: { text: 'sanggol', respell: 'sang-GOL', ipa: 'saŋˈgol', variants: ['bebe'], status: 'pending' },
        ceb: { text: 'masuso', respell: 'ma-SOO-so', ipa: 'maˈsu.so', status: 'pending' },
        ilo: { text: 'maladaga', respell: 'ma-la-DA-ga', ipa: 'ma.laˈda.ga', status: 'pending' },
        hil: { text: 'lapsag', respell: 'LAP-sag', ipa: 'ˈlap.sag', status: 'pending' },
      },
    },
    {
      id: 'family.sibling',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'sibling',
      art: 'sibling',
      forms: {
        tl: { text: 'kapatid', respell: 'ka-pa-TID', ipa: 'ka.paˈtid', status: 'pending' },
        ceb: { text: 'igsoon', respell: 'ig-SO-on', ipa: 'ʔigˈso.ʔon', status: 'pending' },
        ilo: { text: 'kabsat', respell: 'KAB-sat', ipa: 'ˈkab.sat', status: 'pending' },
        hil: { text: 'utod', respell: 'OO-tod', ipa: 'ˈʔu.tod', status: 'pending' },
      },
    },
    {
      id: 'family.older_sister',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'older sister',
      art: 'sister',
      forms: {
        tl: { text: 'ate', respell: 'AH-teh', ipa: 'ˈʔa.te', status: 'pending' },
        ceb: { text: 'ate', respell: 'AH-teh', ipa: 'ˈʔa.te', variants: ['inday'], status: 'pending' },
        ilo: { text: 'manang', respell: 'MA-nang', ipa: 'ˈma.naŋ', status: 'pending' },
        hil: { text: 'manang', respell: 'MA-nang', ipa: 'ˈma.naŋ', status: 'pending' },
      },
    },
    {
      id: 'family.grandmother',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'grandmother',
      art: 'grandmother',
      forms: {
        tl: { text: 'lola', respell: 'LO-la', ipa: 'ˈlo.la', status: 'pending' },
        ceb: { text: 'lola', respell: 'LO-la', ipa: 'ˈlo.la', variants: ['apohan'], status: 'pending' },
        ilo: { text: 'lola', respell: 'LO-la', ipa: 'ˈlo.la', variants: ['apong baket'], status: 'pending' },
        hil: { text: 'lola', respell: 'LO-la', ipa: 'ˈlo.la', status: 'pending' },
      },
    },
    {
      id: 'family.grandfather',
      topic: 'pamilya',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'grandfather',
      art: 'grandfather',
      forms: {
        tl: { text: 'lolo', respell: 'LO-loh', ipa: 'ˈlo.lo', status: 'pending' },
        ceb: { text: 'lolo', respell: 'LO-loh', ipa: 'ˈlo.lo', variants: ['apohan'], status: 'pending' },
        ilo: { text: 'lolo', respell: 'LO-loh', ipa: 'ˈlo.lo', variants: ['apong lakay'], status: 'pending' },
        hil: { text: 'lolo', respell: 'LO-loh', ipa: 'ˈlo.lo', status: 'pending' },
      },
    },
  ],
}
