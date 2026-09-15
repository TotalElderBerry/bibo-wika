import type { Topic } from './types'

/**
 * Colours.
 *
 * A topic with a property none of the others have: the PICTURE and the MEANING
 * are the same thing. There is no drawing of "red" - there is red. So the art
 * for this topic is a paint swatch, and a listen round is four swatches, which
 * is the cleanest exercise in the app for a four-year-old who cannot yet read.
 *
 * The honest part of this file is the `variants`. Every one of these languages
 * has a Spanish loan sitting next to an indigenous word, and which one a child
 * hears at home depends on the household, not the province:
 *
 *   - `berde` (Sp. verde) is what almost everyone says; `luntian` / `lunhaw` /
 *     `nalangto` are the native words, taught in school and used in writing.
 *   - `dilaw` and `duyaw` are native; `dalag` is the Visayan native word, and
 *     `amarilyo` is the loan that competes with it.
 *
 * The taught form is the one a child is most likely to hear spoken. The other
 * is never marked wrong - spec section 03.
 *
 * STATUS: every form is `pending` - spec section 12.
 */
export const kulay: Topic = {
  slug: 'kulay',
  en: 'Colours',
  art: 'color-red',
  title: {
    tl: 'Mga Kulay',
    ceb: 'Mga Kolor',
    ilo: 'Dagiti Maris',
    hil: 'Mga Kolor',
  },
  concepts: [
    {
      id: 'colour.red',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'red',
      art: 'color-red',
      forms: {
        tl: { text: 'pula', respell: 'POO-lah', ipa: 'ˈpu.la', status: 'pending' },
        ceb: { text: 'pula', respell: 'POO-lah', ipa: 'ˈpu.la', status: 'pending' },
        ilo: { text: 'nalabaga', respell: 'na-la-BA-ga', ipa: 'na.laˈba.ga', status: 'pending' },
        hil: { text: 'pula', respell: 'POO-lah', ipa: 'ˈpu.la', status: 'pending' },
      },
    },
    {
      id: 'colour.blue',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'blue',
      art: 'color-blue',
      forms: {
        tl: { text: 'asul', respell: 'a-SUL', ipa: 'ʔaˈsul', variants: ['bughaw'], status: 'pending' },
        ceb: { text: 'asul', respell: 'a-SUL', ipa: 'ʔaˈsul', status: 'pending' },
        ilo: { text: 'asul', respell: 'a-SUL', ipa: 'ʔaˈsul', status: 'pending' },
        hil: { text: 'asul', respell: 'a-SUL', ipa: 'ʔaˈsul', status: 'pending' },
      },
    },
    {
      id: 'colour.yellow',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'yellow',
      art: 'color-yellow',
      forms: {
        tl: { text: 'dilaw', respell: 'di-LAW', ipa: 'diˈlaw', status: 'pending' },
        ceb: { text: 'dalag', respell: 'DA-lag', ipa: 'ˈda.lag', variants: ['amarilyo'], status: 'pending' },
        ilo: { text: 'duyaw', respell: 'du-YAW', ipa: 'duˈjaw', status: 'pending' },
        hil: { text: 'dalag', respell: 'DA-lag', ipa: 'ˈda.lag', variants: ['amarilyo'], status: 'pending' },
      },
    },
    {
      id: 'colour.green',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'green',
      art: 'color-green',
      forms: {
        tl: { text: 'berde', respell: 'BER-deh', ipa: 'ˈbeɾ.de', variants: ['luntian'], status: 'pending' },
        ceb: { text: 'berde', respell: 'BER-deh', ipa: 'ˈbeɾ.de', variants: ['lunhaw'], status: 'pending' },
        ilo: { text: 'berde', respell: 'BER-deh', ipa: 'ˈbeɾ.de', variants: ['nalangto'], status: 'pending' },
        hil: { text: 'berde', respell: 'BER-deh', ipa: 'ˈbeɾ.de', variants: ['lunhaw'], status: 'pending' },
      },
    },
    {
      id: 'colour.black',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'black',
      art: 'color-black',
      forms: {
        tl: { text: 'itim', respell: 'i-TIM', ipa: 'ʔiˈtim', status: 'pending' },
        ceb: { text: 'itom', respell: 'i-TOM', ipa: 'ʔiˈtom', status: 'pending' },
        ilo: { text: 'nangisit', respell: 'na-NGI-sit', ipa: 'naˈŋi.sit', status: 'pending' },
        hil: { text: 'itom', respell: 'i-TOM', ipa: 'ʔiˈtom', status: 'pending' },
      },
    },
    {
      id: 'colour.white',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'white',
      art: 'color-white',
      forms: {
        tl: { text: 'puti', respell: 'pu-TI', ipa: 'puˈtiʔ', status: 'pending' },
        ceb: { text: 'puti', respell: 'pu-TI', ipa: 'puˈtiʔ', status: 'pending' },
        ilo: { text: 'puraw', respell: 'POO-raw', ipa: 'ˈpu.ɾaw', status: 'pending' },
        hil: { text: 'puti', respell: 'pu-TI', ipa: 'puˈtiʔ', status: 'pending' },
      },
    },
    {
      id: 'colour.pink',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'pink',
      art: 'color-pink',
      forms: {
        tl: { text: 'rosas', respell: 'RO-sas', ipa: 'ˈɾo.sas', status: 'pending' },
        ceb: { text: 'rosas', respell: 'RO-sas', ipa: 'ˈɾo.sas', status: 'pending' },
        ilo: { text: 'rosas', respell: 'RO-sas', ipa: 'ˈɾo.sas', status: 'pending' },
        hil: { text: 'rosas', respell: 'RO-sas', ipa: 'ˈɾo.sas', status: 'pending' },
      },
    },
    {
      id: 'colour.orange',
      topic: 'kulay',
      bands: ['usbong', 'puno', 'matanda'],
      en: 'orange',
      art: 'color-orange',
      forms: {
        tl: { text: 'kahel', respell: 'KA-hel', ipa: 'ˈka.hel', variants: ['orange'], status: 'pending' },
        ceb: { text: 'kahel', respell: 'KA-hel', ipa: 'ˈka.hel', variants: ['orange'], status: 'pending' },
        ilo: { text: 'kahel', respell: 'KA-hel', ipa: 'ˈka.hel', variants: ['orange'], status: 'pending' },
        hil: { text: 'kahel', respell: 'KA-hel', ipa: 'ˈka.hel', variants: ['orange'], status: 'pending' },
      },
    },
  ],
}
