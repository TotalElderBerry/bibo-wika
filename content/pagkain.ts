import type { Topic } from './types'

/**
 * Food.
 *
 * The topic where the four-column model earns its keep on vocabulary a child
 * uses every single day:
 *
 *   - `food.rice`     four-way split, and the one word every Filipino child
 *                     already knows in their own language before they arrive
 *   - `food.water`    Ilocano `danum` against `tubig` in the other three
 *   - `food.coconut`  the Visayan `lubi` / Luzon `niyog` line, which runs
 *                     straight through the middle of this app's audience
 *   - `food.mango`    identical in all four, so a child gets an early win
 *
 * Rice is `kanin` in Tagalog only when it is COOKED - the plant is `palay` and
 * the milled grain is `bigas`. This topic teaches the cooked form, which is
 * what is on the plate in the picture. The other two are Puno-band words.
 *
 * STATUS: every form is `pending`. No audio recorded. Nothing ships to a child
 * until two native reviewers per language approve it - spec section 12.
 */
export const pagkain: Topic = {
  slug: 'pagkain',
  en: 'Food',
  art: 'rice',
  title: {
    tl: 'Pagkain',
    ceb: 'Pagkaon',
    ilo: 'Taraon',
    hil: 'Pagkaon',
  },
  concepts: [
    {
      id: 'food.rice',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'cooked rice',
      art: 'rice',
      forms: {
        tl: { text: 'kanin', respell: 'KA-nin', ipa: 'ˈka.nin', status: 'pending' },
        ceb: { text: 'kan-on', respell: 'KAN-on', ipa: 'ˈkan.ʔon', status: 'pending' },
        ilo: { text: 'innapuy', respell: 'in-na-POOY', ipa: 'ʔin.naˈpuj', status: 'pending' },
        hil: { text: 'kan-on', respell: 'KAN-on', ipa: 'ˈkan.ʔon', status: 'pending' },
      },
    },
    {
      id: 'food.water',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'water',
      art: 'water',
      forms: {
        tl: { text: 'tubig', respell: 'TOO-big', ipa: 'ˈtu.big', status: 'pending' },
        ceb: { text: 'tubig', respell: 'TOO-big', ipa: 'ˈtu.big', status: 'pending' },
        ilo: { text: 'danum', respell: 'DA-num', ipa: 'ˈda.num', status: 'pending' },
        hil: { text: 'tubig', respell: 'TOO-big', ipa: 'ˈtu.big', status: 'pending' },
      },
    },
    {
      id: 'food.banana',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'banana',
      art: 'banana',
      forms: {
        tl: { text: 'saging', respell: 'SA-ging', ipa: 'ˈsa.giŋ', status: 'pending' },
        ceb: { text: 'saging', respell: 'SA-ging', ipa: 'ˈsa.giŋ', status: 'pending' },
        ilo: { text: 'saba', respell: 'SA-ba', ipa: 'ˈsa.ba', variants: ['saging'], status: 'pending' },
        hil: { text: 'saging', respell: 'SA-ging', ipa: 'ˈsa.giŋ', status: 'pending' },
      },
    },
    {
      id: 'food.mango',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'mango',
      art: 'mango',
      forms: {
        tl: { text: 'mangga', respell: 'mang-GA', ipa: 'maŋˈga', status: 'pending' },
        ceb: { text: 'mangga', respell: 'mang-GA', ipa: 'maŋˈga', status: 'pending' },
        ilo: { text: 'mangga', respell: 'mang-GA', ipa: 'maŋˈga', status: 'pending' },
        hil: { text: 'mangga', respell: 'mang-GA', ipa: 'maŋˈga', status: 'pending' },
      },
    },
    {
      id: 'food.egg',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'egg',
      art: 'egg',
      forms: {
        tl: { text: 'itlog', respell: 'it-LOG', ipa: 'ʔitˈlog', status: 'pending' },
        ceb: { text: 'itlog', respell: 'it-LOG', ipa: 'ʔitˈlog', status: 'pending' },
        ilo: { text: 'itlog', respell: 'it-LOG', ipa: 'ʔitˈlog', status: 'pending' },
        hil: { text: 'itlog', respell: 'it-LOG', ipa: 'ʔitˈlog', status: 'pending' },
      },
    },
    {
      id: 'food.bread',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'bread',
      art: 'bread',
      forms: {
        tl: { text: 'tinapay', respell: 'ti-na-PAY', ipa: 'ti.naˈpaj', status: 'pending' },
        ceb: { text: 'pan', respell: 'PAN', ipa: 'ˈpan', variants: ['tinapay'], status: 'pending' },
        ilo: { text: 'tinapay', respell: 'ti-na-PAY', ipa: 'ti.naˈpaj', status: 'pending' },
        hil: { text: 'tinapay', respell: 'ti-na-PAY', ipa: 'ti.naˈpaj', variants: ['pan'], status: 'pending' },
      },
    },
    {
      id: 'food.coconut',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'coconut',
      art: 'coconut',
      forms: {
        tl: { text: 'niyog', respell: 'ni-YOG', ipa: 'niˈjog', status: 'pending' },
        ceb: { text: 'lubi', respell: 'LOO-bi', ipa: 'ˈlu.bi', status: 'pending' },
        ilo: { text: 'niog', respell: 'ni-OG', ipa: 'niˈʔog', status: 'pending' },
        hil: { text: 'lubi', respell: 'LOO-bi', ipa: 'ˈlu.bi', status: 'pending' },
      },
    },
    {
      id: 'food.soup',
      topic: 'pagkain',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'soup',
      art: 'soup',
      forms: {
        tl: { text: 'sabaw', respell: 'sa-BAW', ipa: 'saˈbaw', status: 'pending' },
        ceb: { text: 'sabaw', respell: 'sa-BAW', ipa: 'saˈbaw', status: 'pending' },
        ilo: { text: 'digo', respell: 'DEE-go', ipa: 'ˈdi.go', status: 'pending' },
        hil: { text: 'sabaw', respell: 'sa-BAW', ipa: 'saˈbaw', status: 'pending' },
      },
    },
  ],
}
