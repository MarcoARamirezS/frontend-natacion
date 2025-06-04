// plugins/axios.ts
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const token = useCookie('token')

  const instance = axios.create({
    baseURL: 'http://localhost:5020/api',
  })

  // Interceptor para agregar el token automáticamente
  instance.interceptors.request.use((config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  return {
    provide: {
      axios: instance
    }
  }
})
