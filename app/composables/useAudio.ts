import type { Lang } from '~~/content/types'

type Speakable = { conceptId: string; lang: Lang; text: string; status: string }

/**
 * Playback for recorded native-speaker audio.
 *
 * There is NO usable text-to-speech for Cebuano, Ilocano or Hiligaynon in any
 * browser or mobile OS, and Filipino TTS is mediocre. Synthesis is therefore a
 * DEVELOPMENT PLACEHOLDER ONLY, behind `NUXT_PUBLIC_DEV_TTS`, so that exercise
 * flows can be built before the studio recordings land. It must be off in any
 * build a child will touch - it would teach wrong pronunciation, which is the
 * one thing this product exists to get right. Spec section 08.
 */
export function useAudio() {
  const cfg = useRuntimeConfig().public
  const playing = ref(false)
  const usingPlaceholder = ref(false)

  let el: HTMLAudioElement | null = null
  const cache = new Map<string, HTMLAudioElement>()

  function clipUrl(conceptId: string, lang: Lang) {
    return `${cfg.mediaBase}/audio/${lang}/${conceptId}.opus`
  }

  function stop() {
    el?.pause()
    window.speechSynthesis?.cancel()
    playing.value = false
  }

  /** Dev-only. Approximates with a Filipino voice; never ships. */
  function placeholder(text: string) {
    if (!cfg.devTts || !('speechSynthesis' in window)) return false
    usingPlaceholder.value = true
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'fil-PH'
    u.rate = 0.78
    u.onend = () => (playing.value = false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
    return true
  }

  async function say(item: Speakable) {
    stop()
    playing.value = true
    usingPlaceholder.value = false

    // Only approved recordings are ever played to a child.
    if (item.status === 'approved' && cfg.mediaBase) {
      const url = clipUrl(item.conceptId, item.lang)
      let audio = cache.get(url)
      if (!audio) {
        audio = new Audio(url)
        audio.preload = 'auto'
        cache.set(url, audio)
      }
      el = audio
      audio.currentTime = 0
      try {
        await audio.play()
        audio.onended = () => (playing.value = false)
        return
      } catch {
        // Fall through to the placeholder path below.
      }
    }

    if (!placeholder(item.text)) {
      // No recording and no placeholder: the exercise still works, because
      // every audio prompt carries a picture and visible text. Spec section 11.
      playing.value = false
    }
  }

  onScopeDispose(stop)

  return { say, stop, playing, usingPlaceholder }
}
