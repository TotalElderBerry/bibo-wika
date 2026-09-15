export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/magulang')) return

  const publicRoutes = new Set(['/magulang/login', '/magulang/register'])
  const isPublic = publicRoutes.has(to.path)
  const auth = useAuth()

  if (!auth.loaded.value) {
    await auth.refresh().catch(() => {
      auth.loaded.value = true
    })
  }

  if (!auth.parent.value && !isPublic) {
    return navigateTo({ path: '/magulang/login', query: { next: to.fullPath } })
  }

  if (auth.parent.value && isPublic) {
    return navigateTo('/magulang')
  }
})
