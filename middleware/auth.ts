import { jwtDecode } from 'jwt-decode'

export default defineNuxtRouteMiddleware((_to, _from) => {
  const token = useCookie('token')

  if (!token.value) {
    return navigateTo('/')
  }

  try {
    const decoded = jwtDecode<{ exp?: number }>(token.value)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      useCookie('token').value = null
      return navigateTo('/')
    }
  } catch (error) {
    useCookie('token').value = null
    return navigateTo('/')
  }
})
