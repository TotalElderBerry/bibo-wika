interface ParentAccount {
  id: string
  displayName: string
  email: string
}

interface AuthResponse {
  parent: ParentAccount | null
}

function authErrorMessage(err: unknown) {
  if (typeof err === 'object' && err && 'data' in err) {
    const data = (err as { data?: { statusMessage?: string; message?: string } }).data
    return data?.statusMessage || data?.message || 'May nangyaring mali.'
  }
  return 'May nangyaring mali.'
}

export function useAuth() {
  const parent = useState<ParentAccount | null>('auth.parent', () => null)
  const loaded = useState('auth.loaded', () => false)

  async function refresh() {
    const requestFetch = import.meta.server ? useRequestFetch() : $fetch
    const res = await requestFetch<AuthResponse>('/api/auth/me')
    parent.value = res.parent
    loaded.value = true
    return parent.value
  }

  async function login(email: string, password: string) {
    const res = await $fetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    }).catch((err) => {
      throw new Error(authErrorMessage(err))
    })

    parent.value = res.parent
    loaded.value = true
    return parent.value
  }

  async function register(displayName: string, email: string, password: string) {
    const res = await $fetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: { displayName, email, password },
    }).catch((err) => {
      throw new Error(authErrorMessage(err))
    })

    parent.value = res.parent
    loaded.value = true
    return parent.value
  }

  async function logout() {
    // Clear local state even when the request fails. A network error here used
    // to reject silently and leave a parent looking signed in on a screen they
    // asked to leave; a redundant sign-out is the safer of the two failures.
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      parent.value = null
      loaded.value = true
      await navigateTo('/magulang/login')
    }
  }

  return {
    parent,
    loaded,
    refresh,
    login,
    register,
    logout,
  }
}
