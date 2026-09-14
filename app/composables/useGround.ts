/**
 * Day / night ground. `araw` is the default; `gabi` darkens the table the
 * stickers sit on without inverting the artwork. Follows the device until a
 * child (or parent) picks one, then stays picked.
 */
export function useGround() {
  const KEY = 'bibo.ground'
  const mode = useState<'auto' | 'araw' | 'gabi'>('ground', () => 'auto')

  onMounted(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === 'araw' || saved === 'gabi') mode.value = saved
    } catch {
      // Blocked storage: stay on auto. Never throw.
    }
    apply()
  })

  function apply() {
    const el = document.documentElement
    if (mode.value === 'auto') el.removeAttribute('data-ground')
    else el.setAttribute('data-ground', mode.value)
  }

  function toggle() {
    const isNight =
      mode.value === 'gabi' ||
      (mode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    mode.value = isNight ? 'araw' : 'gabi'
    try {
      localStorage.setItem(KEY, mode.value)
    } catch {
      // Fine - the choice just will not survive a reload.
    }
    apply()
  }

  const icon = computed(() => (mode.value === 'gabi' ? '☀️' : '🌙'))
  const label = computed(() => (mode.value === 'gabi' ? 'Switch to day' : 'Switch to night'))

  return { mode, toggle, icon, label }
}
