import { defineStore } from 'pinia'
import { get, set } from 'idb-keyval'
import type { Lang } from '~~/content/types'
import type { BuddyName } from '~/utils/buddies'

const KEY = 'bibo.profile.v1'

interface ProfileState {
  ready: boolean
  buddy: BuddyName | null
  lang: Lang | null
  band: 'usbong' | 'puno'
  xp: number
  /** conceptId:lang -> Leitner box. Local-first; syncs only if a parent opts in. */
  boxes: Record<string, number>
}

/**
 * Local-first. A profile lives on the device and needs no account: a child
 * never logs in, and nothing here reaches a server unless a parent creates one.
 * Spec section 11.
 */
export const useProfile = defineStore('profile', {
  state: (): ProfileState => ({
    ready: false,
    buddy: null,
    lang: null,
    band: 'usbong',
    xp: 0,
    boxes: {},
  }),

  getters: {
    started: (s) => Boolean(s.buddy && s.lang),
  },

  actions: {
    async load() {
      if (this.ready) return
      const saved = await get<Partial<ProfileState>>(KEY).catch(() => null)
      if (saved) Object.assign(this, saved)
      this.ready = true
    },

    async persist() {
      const { ready: _ready, ...rest } = this.$state
      try {
        // Pinia state is a Vue reactive Proxy, and IndexedDB clones structurally
        // - a Proxy is not structured-cloneable, so writing `rest` directly
        // throws DataCloneError and nothing is ever saved. Snapshot to plain
        // JSON first. The state is deliberately JSON-safe for this reason.
        await set(KEY, JSON.parse(JSON.stringify(rest)))
      } catch (err) {
        // Private mode or blocked storage is survivable: the session keeps
        // working, it just will not outlive a reload. Never throw at a child -
        // but never swallow it silently in development either.
        if (import.meta.dev) console.warn('[profile] persist failed', err)
      }
    },

    async pickBuddy(buddy: BuddyName) {
      this.buddy = buddy
      await this.persist()
    },

    async pickLang(lang: Lang) {
      this.lang = lang
      await this.persist()
    },

    async award(xp: number) {
      this.xp += xp
      await this.persist()
    },

    /** Leitner promote / demote. Intervals are halved in Usbong - section 06. */
    async record(conceptId: string, lang: Lang, correct: boolean) {
      const k = `${conceptId}:${lang}`
      const box = this.boxes[k] ?? 1
      this.boxes[k] = correct ? Math.min(5, box + 1) : Math.max(1, box - 1)
      await this.persist()
    },

    async reset() {
      this.buddy = null
      this.lang = null
      this.xp = 0
      this.boxes = {}
      await this.persist()
    },
  },
})
