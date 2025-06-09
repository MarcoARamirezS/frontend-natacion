<script setup>
import { ref, onMounted, watch } from 'vue'
import CalendarioSemana from './CalendarioSemana.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { useNuxtApp } from '#app'

const axios = useNuxtApp().$axios

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const horas = []
for (let h = 6; h <= 22; h++) {
  horas.push(h.toString().padStart(2, '0') + ':00')
}

const jornadas = ref([])
const dialogEditar = ref(false)

const confirmDialogRef = ref(null)
const mensajeConfirmacion = ref('')

const cargarJornadas = async () => {
  try {
    const { data } = await axios.get('/jornadas/')
    jornadas.value = data
  } catch (error) {
    console.error('Error cargando jornadas:', error)
  }
}

watch(dialogEditar, (nuevoValor) => {
  if (nuevoValor) {
    jornadas.value.sort((a, b) => {
      return diasSemana.indexOf(a.diaSemana) - diasSemana.indexOf(b.diaSemana)
    })
  }
})

const agregarRangoDirecto = (nuevoRango) => {
  jornadas.value.push({ ...nuevoRango })
}

const eliminarJornada = async (index) => {
  const j = jornadas.value[index]
  mensajeConfirmacion.value = `¿Deseas eliminar la jornada del ${j.diaSemana} de ${j.horaInicio} a ${j.horaFin}?`
  const confirmado = await confirmDialogRef.value.abrir()
  if (!confirmado) return

  jornadas.value.splice(index, 1)
}

const guardarJornada = async (index) => {
  const j = jornadas.value[index]
  mensajeConfirmacion.value = `¿Deseas guardar la jornada del ${j.diaSemana} de ${j.horaInicio} a ${j.horaFin}?`
  const confirmado = await confirmDialogRef.value.abrir()
  if (!confirmado) return

  try {
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

    <v-dialog v-model="dialogEditar" max-width="800">
      <v-card>
        <v-card-title class="text-h6">
          Editar Jornadas
          <v-spacer />
          <v-btn icon @click="dialogEditar = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="(j, index) in jornadas"
              :key="index"
              class="justify-between"
            >
              <div>
                {{ j.diaSemana }}: {{ j.horaInicio }} - {{ j.horaFin }}
              </div>
              <v-btn
                icon
                color="red"
                @click="eliminarJornada(index)"
                title="Eliminar jornada"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ConfirmDialog
      ref="confirmDialogRef"
      :titulo="'Confirmar acción'"
      :mensaje="mensajeConfirmacion"
    />
  </v-card>
</template>
