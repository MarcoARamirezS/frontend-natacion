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

const cargarJornadas = async () => {
  try {
    const { data } = await axios.get('/jornadas/')
    jornadas.value = data
  } catch (error) {
    console.error('Error cargando jornadas:', error)
  }
}

const agregarJornada = () => {
  jornadas.value.push({
    diaSemana: 'Lunes',
    horaInicio: '07:00',
    horaFin: '10:00',
  })
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
    <v-card-title>Configurar Jornadas</v-card-title>
    <v-card-text>
      <v-btn color="primary" class="mb-4" @click="agregarJornada">Agregar Jornada</v-btn>

      <v-row
        v-for="(j, i) in jornadas"
        :key="i"
        class="mb-2"
        align="center"
        style="justify-content: space-evenly;"
        no-gutters
      >
        <v-col cols="3" class="d-flex justify-center">
          <v-select
            v-model="j.diaSemana"
            :items="diasSemana"
            label="Día Semana"
            dense
            hide-details
          />
        </v-col>
        <v-col cols="3" class="d-flex justify-center">
          <v-select
            v-model="j.horaInicio"
            :items="horas"
            label="Hora Inicio"
            dense
            hide-details
          />
        </v-col>
        <v-col cols="3" class="d-flex justify-center">
          <v-select
            v-model="j.horaFin"
            :items="horas"
            label="Hora Fin"
            dense
            hide-details
          />
        </v-col>
        <v-col
          cols="1"
          class="d-flex align-center"
          style="gap: 8px;"
        >
          <v-btn icon color="green" @click="guardarJornada(i)" class="mr-2">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn icon color="red" @click="eliminarJornada(i)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>


      <v-divider class="my-6" />

      <CalendarioSemana :jornadas="jornadas" />
    </v-card-text>
  </v-card>
</template>
