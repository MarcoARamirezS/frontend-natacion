<script setup>
import { ref, onMounted, watch } from 'vue'
import CalendarioSemana from './CalendarioSemana.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import EditarJornadas from './EditarJornadas.vue'
import { useNuxtApp } from '#app'

const axios = useNuxtApp().$axios

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const jornadas = ref([])
const dialogEditar = ref(false)
const confirmDialogRef = ref(null)
const mensajeConfirmacion = ref('')

const cargarJornadas = async () => {
  try {
    const { data } = await axios.get('/jornadas/')
    jornadas.value = data
    jornadas.value.sort((a, b) => {
      return diasSemana.indexOf(a.diaSemana) - diasSemana.indexOf(b.diaSemana)
    })
  } catch (error) {
    console.error('Error cargando jornadas:', error)
  }
}

const agregarRangoDirecto = (nuevoRango) => {
  jornadas.value = [...jornadas.value, { ...nuevoRango }]
}

const guardarJornada = async (index) => {
  const j = jornadas.value[index]
  mensajeConfirmacion.value = `¿Deseas guardar la jornada del ${j.diaSemana} de ${j.horaInicio} a ${j.horaFin}?`
  const confirmado = await confirmDialogRef.value.abrir()
  if (!confirmado) return

  try {
    await axios.post('/jornadas/', j)
    alert(`Jornada guardada: ${j.diaSemana} ${j.horaInicio}-${j.horaFin}`)
    await cargarJornadas()
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
      <v-btn color="secondary" class="ml-2" @click="dialogEditar = true">
        Editar Rangos
      </v-btn>
    </v-card-title>

    <CalendarioSemana
      :jornadas="jornadas"
      @nuevo-rango="async (nuevoRango) => {
        agregarRangoDirecto(nuevoRango)
        await guardarJornada(jornadas.length - 1)
      }"
    />

    <!-- Componente nuevo reemplazando el antiguo v-dialog -->
    <EditarJornadas
      v-model="dialogEditar"
      :jornadas="jornadas"
      @jornadas-actualizadas="cargarJornadas"
    />

    <ConfirmDialog
      ref="confirmDialogRef"
      :titulo="'Confirmar acción'"
      :mensaje="mensajeConfirmacion"
    />
  </v-card>
</template>
