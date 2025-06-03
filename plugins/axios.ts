// plugins/axios.ts
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: 'http://localhost:3001', // Tu backend
  })

  return {
    provide: {
      axios: instance
    }
  }
})
