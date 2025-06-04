import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#4ED7F1',   // Color principal (cyan suave)
            secondary: '#6FE6FC', // Alternativo, más brillante
            accent: '#A8F1FF',    // Color para destacar elementos
            warning: '#FFFA8D',   // Amarillo suave
            error: '#FF5252',
            info: '#4ED7F1',
            success: '#4CAF50',
          },
        },
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
