// nuxt.d.ts
export {}

declare module '#app' {
  interface NuxtApp {
    $axios: ReturnType<typeof import('axios').default>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: ReturnType<typeof import('axios').default>
  }
}
