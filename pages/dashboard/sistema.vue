<script setup>
import { ref } from 'vue'
import ConfigurarJornada from '~/components/ui/ConfigurarJornada.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const tab = ref(0)
</script>

<template>
  <v-container fluid class="ma-3">
    <client-only>
      <v-tabs v-model="tab" bg-color="primary" dark>
        <v-tab>Configurar Jornada</v-tab>
        <v-tab>Otra opción</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="mt-4">
        <v-window-item :value="0">
          <ConfigurarJornada />
        </v-window-item>

        <v-window-item :value="1">
          <v-card class="pa-4">
            <v-card-text>Contenido de otra opción</v-card-text>
          </v-card>
        </v-window-item>
      </v-window>
    </client-only>
  </v-container>
</template>
