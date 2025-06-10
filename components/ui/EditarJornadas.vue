<template>
  <v-dialog v-model="dialogVisible" max-width="800">
    <v-card>
      <v-card-title class="text-h6">
        Editar Jornadas
        <v-spacer />
        <v-btn icon @click="dialogVisible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(j, index) in jornadas"
            :key="j.id || index"
            class="justify-between"
          >
            <div
              class="d-flex align-center flex-wrap"
              style="gap: 12px; width: 100%;"
            >
              <div style="min-width: 120px; font-weight: 600;">{{ j.diaSemana }}:</div>

              <!-- Hora Inicio -->
              <v-text-field
                v-model="j.horaInicio"
                label="Inicio"
                type="time"
                dense
                style="max-width: 140px;"
                step="3600"
                @change="guardarJornada(j)"
              />

              <!-- Hora Fin -->
              <v-text-field
                v-model="j.horaFin"
                label="Fin"
                type="time"
                dense
                style="max-width: 140px;"
                step="3600"
                @change="guardarJornada(j)"
              />

              <v-btn
                icon
                color="green"
                title="Guardar"
                @click="guardarJornada(j)"
              >
                <v-icon>mdi-content-save</v-icon>
              </v-btn>

              <v-btn
                icon
                color="red"
                title="Eliminar"
                @click="eliminarJornada(j)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useNuxtApp } from '#app'

// Props y emits
const props = defineProps({
  modelValue: Boolean,
  jornadas: Array
})
const emit = defineEmits(['update:modelValue', 'jornadasActualizadas'])

// Axios (nuxt3 + axios module)
const axios = useNuxtApp().$axios

// Control local dialog
const dialogVisible = ref(props.modelValue)
watch(() => props.modelValue, val => dialogVisible.value = val)
watch(dialogVisible, val => emit('update:modelValue', val))

// Funciones
const guardarJornada = async (jornada) => {
  try {
    await axios.put(`/jornadas/${jornada.id}`, {
      diaSemana: jornada.diaSemana,
      horaInicio: jornada.horaInicio,
      horaFin: jornada.horaFin,
    })
    emit('jornadasActualizadas')
  } catch (error) {
    console.error('Error actualizando jornada', error)
  }
}

const eliminarJornada = async (jornada) => {
  try {
    await axios.delete(`/jornadas/${jornada.id}`)
    emit('jornadasActualizadas')
  } catch (error) {
    console.error('Error eliminando jornada', error)
  }
}
</script>
