const PUBLIC_ROUTES = ['/', '/register']

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('accessToken')

    if (token && PUBLIC_ROUTES.includes(to.path)) {
      return navigateTo('/home')
    }

    if (!token && !PUBLIC_ROUTES.includes(to.path)) {
      return navigateTo('/')
    }
  }
})
