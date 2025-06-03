// plugins/axios.ts
import axios from 'axios'

export default defineNuxtPlugin(() => {
  const instance = axios.create({
    baseURL: 'http://localhost:5020/api', // Local Backend
  })

  return {
    provide: {
      axios: instance
    }
  }
})
