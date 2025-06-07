<script setup>
import { ref, onMounted } from 'vue'
import CalendarioSemana from './CalendarioSemana.vue'
import { useNuxtApp } from '#app'

const axios = useNuxtApp().$axios

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const horas = []
for (let h = 6; h <= 22; h++) {
  horas.push(h.toString().padStart(2, '0') + ':00')
}

const jornadas = ref([])
const dialogEditar = ref(false) // 💬 Para abrir/cerrar el diálogo

const cargarJornadas = async () => {
  try {
    const { data } = await axios.get('/jornadas/')
    jornadas.value = data
  } catch (error) {
    console.error('Error cargando jornadas:', error)
  }
}

const agregarRangoDirecto = (j) => {
  jornadas.value.push({ ...j })
}

const eliminarJornada = (index) => {
  jornadas.value.splice(index, 1)
}

const guardarJornada = async (index) => {
  try {
    const j = jornadas.value[index]
    await axios.post('/jornadas/', j)
    alert(`Jornada guardada: ${j.diaSemana} ${j.horaInicio}-${j.horaFin}`)
  } catch (error) {
    console.error('Error guardando jornada:', error)
    alert('Error al guardar jornada.')
  }
}

onMounted(() => {
  cargarJornadas()
})
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="d-flex justify-between align-center">
      Configurar Jornadas
      <v-btn color="secondary" @click="dialogEditar = true">
        Editar Rangos
      </v-btn>
    </v-card-title>

    <v-card-text>
      <CalendarioSemana :jornadas="jornadas" @nuevo-rango="agregarRangoDirecto" />
    </v-card-text>
  </v-card>

  <!-- 💬 Diálogo para edición -->
  <v-dialog v-model="dialogEditar" width="900px">
    <v-card>
      <!-- Header con título y botón de cerrar alineado a la derecha -->
      <v-card-title class="d-flex justify-between align-center">
        <span class="text-h6">Editar Rangos Actuales</span>
        <v-btn icon @click="dialogEditar = false" class="ml-auto">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <!-- Renglones de jornadas con distribución space-evenly -->
        <v-row
          v-for="(j, i) in jornadas"
          :key="i"
          class="mb-2"
          align="center"
          no-gutters
        >
          <v-col cols="4">
            <v-select
              v-model="j.diaSemana"
              :items="diasSemana"
              label="Día Semana"
              dense
              hide-details
            />
          </v-col>

          <v-col cols="3">
            <v-select
              v-model="j.horaInicio"
              :items="horas"
              label="Hora Inicio"
              dense
              hide-details
            />
          </v-col>

          <v-col cols="3">
            <v-select
              v-model="j.horaFin"
              :items="horas"
              label="Hora Fin"
              dense
              hide-details
            />
          </v-col>

          <v-col cols="2" class="d-flex justify-center">
            <v-btn icon color="green" @click="guardarJornada(i)">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <v-btn icon color="red" @click="eliminarJornada(i)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn text @click="dialogEditar = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
