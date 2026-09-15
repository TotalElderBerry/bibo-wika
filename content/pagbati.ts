import type { Topic } from './types'

/**
 * Greetings.
 *
 * The only topic in the curriculum made of PHRASES rather than single words,
 * and the one where the four languages diverge most visibly:
 *
 *     magandang umaga / maayong buntag / naimbag a bigat / maayong aga
 *
 * Four completely different constructions for the same sentence. Tagalog and
 * Hiligaynon share `aga`, Cebuano has its own word for morning, and Ilocano
 * builds the phrase with a linker. Salita Sabayan on `greeting.good_morning`
 * is the single best card in the app for showing a child that these are
 * related languages rather than one language with four accents.
 *
 * Three consequences of phrases, for whoever records these:
 *
 *   - Clips are longer. The 1100ms gap `playAll` uses in Salita Sabayan was
 *     tuned on single words and will need revisiting for this topic.
 *   - `ipa` is omitted on the multi-word forms. A phrase-level transcription
 *     invites false precision about phrasing and juncture that a reviewer
 *     should decide at the microphone, not an author in a file.
 *   - Respelling carries the stress of each word, separated as spoken.
 *
 * STATUS: every form is `pending` - spec section 12.
 */
export const pagbati: Topic = {
  slug: 'pagbati',
  en: 'Greetings',
  art: 'wave',
  title: {
    tl: 'Pagbati',
    ceb: 'Pagtimbaya',
    ilo: 'Kablaaw',
    hil: 'Pagtamyaw',
  },
  concepts: [
    {
      id: 'greeting.hello',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'hello / how are you',
      art: 'wave',
      forms: {
        tl: { text: 'kumusta', respell: 'ku-MUS-ta', ipa: 'kuˈmus.ta', status: 'pending' },
        ceb: { text: 'kumusta', respell: 'ku-MUS-ta', ipa: 'kuˈmus.ta', status: 'pending' },
        ilo: { text: 'kumusta', respell: 'ku-MUS-ta', ipa: 'kuˈmus.ta', status: 'pending' },
        hil: { text: 'kumusta', respell: 'ku-MUS-ta', ipa: 'kuˈmus.ta', status: 'pending' },
      },
    },
    {
      id: 'greeting.good_morning',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'good morning',
      art: 'sunrise',
      forms: {
        tl: { text: 'magandang umaga', respell: 'ma-gan-DANG u-MA-ga', status: 'pending' },
        ceb: { text: 'maayong buntag', respell: 'ma-A-yong BUN-tag', status: 'pending' },
        ilo: { text: 'naimbag a bigat', respell: 'na-IM-bag a BI-gat', status: 'pending' },
        hil: { text: 'maayong aga', respell: 'ma-A-yong A-ga', status: 'pending' },
      },
    },
    {
      id: 'greeting.good_afternoon',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'good afternoon',
      art: 'sun-high',
      forms: {
        tl: { text: 'magandang hapon', respell: 'ma-gan-DANG HA-pon', status: 'pending' },
        ceb: { text: 'maayong hapon', respell: 'ma-A-yong HA-pon', status: 'pending' },
        ilo: { text: 'naimbag a malem', respell: 'na-IM-bag a MA-lem', status: 'pending' },
        hil: { text: 'maayong hapon', respell: 'ma-A-yong HA-pon', status: 'pending' },
      },
    },
    {
      id: 'greeting.good_evening',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'good evening',
      art: 'moon',
      forms: {
        tl: { text: 'magandang gabi', respell: 'ma-gan-DANG ga-BI', status: 'pending' },
        ceb: { text: 'maayong gabii', respell: 'ma-A-yong ga-BI-i', status: 'pending' },
        ilo: { text: 'naimbag a rabii', respell: 'na-IM-bag a ra-BI-i', status: 'pending' },
        hil: { text: 'maayong gab-i', respell: 'ma-A-yong GAB-i', status: 'pending' },
      },
    },
    {
      id: 'greeting.thank_you',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'thank you',
      art: 'thanks',
      forms: {
        tl: { text: 'salamat', respell: 'sa-LA-mat', ipa: 'saˈla.mat', status: 'pending' },
        ceb: { text: 'salamat', respell: 'sa-LA-mat', ipa: 'saˈla.mat', status: 'pending' },
        ilo: { text: 'agyamanak', respell: 'ag-ya-MA-nak', ipa: 'ʔag.jaˈma.nak', variants: ['dios ti agngina'], status: 'pending' },
        hil: { text: 'salamat', respell: 'sa-LA-mat', ipa: 'saˈla.mat', status: 'pending' },
      },
    },
    {
      id: 'greeting.yes',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'yes',
      art: 'yes',
      forms: {
        tl: { text: 'oo', respell: 'O-o', ipa: 'ˈʔo.ʔo', status: 'pending' },
        ceb: { text: 'oo', respell: 'O-o', ipa: 'ˈʔo.ʔo', status: 'pending' },
        ilo: { text: 'wen', respell: 'WEN', ipa: 'ˈwen', status: 'pending' },
        hil: { text: 'huo', respell: 'HU-o', ipa: 'ˈhu.ʔo', status: 'pending' },
      },
    },
    {
      id: 'greeting.no',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: 'no',
      art: 'no',
      forms: {
        tl: { text: 'hindi', respell: 'hin-DI', ipa: 'hinˈdiʔ', status: 'pending' },
        ceb: { text: 'dili', respell: 'DI-li', ipa: 'ˈdi.li', status: 'pending' },
        ilo: { text: 'saan', respell: 'sa-AN', ipa: 'saˈʔan', status: 'pending' },
        hil: { text: 'indi', respell: 'IN-di', ipa: 'ˈʔin.diʔ', status: 'pending' },
      },
    },
    {
      id: 'greeting.youre_welcome',
      topic: 'pagbati',
      bands: ['usbong', 'puno'],
      en: "you're welcome",
      art: 'welcome',
      forms: {
        tl: { text: 'walang anuman', respell: 'wa-LANG a-nu-MAN', status: 'pending' },
        ceb: { text: 'walay sapayan', respell: 'wa-LAY sa-PA-yan', status: 'pending' },
        ilo: { text: 'awan ti anyaman', respell: 'A-wan ti an-YA-man', status: 'pending' },
        hil: { text: 'wala sing ano-ano', respell: 'wa-LA sing A-no-A-no', status: 'pending' },
      },
    },
  ],
}
