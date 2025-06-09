<script setup>
import { ref } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const dialogoConfirmacion = ref(null)

const props = defineProps({
  jornadas: Array,
})

const emit = defineEmits(['nuevo-rango'])

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const horas = []
for (let h = 7; h <= 22; h++) {
  horas.push(`${h.toString().padStart(2, '0')}:00`)
}

const seleccion = ref({
  dia: null,
  inicio: null,
  fin: null,
})

function estaEnRango(hora, horaInicio, horaFin) {
  const toMin = (h) => {
    const [hh, mm] = h.split(':').map(Number)
    return hh * 60 + mm
  }
  const hm = toMin(hora)
  return hm >= toMin(horaInicio) && hm < toMin(horaFin)
}

async function seleccionarCelda(dia, hora) {
  if (!seleccion.value.inicio) {
    seleccion.value.dia = dia
    seleccion.value.inicio = hora
  } else if (!seleccion.value.fin) {
    if (dia !== seleccion.value.dia) {
      alert('El rango debe estar dentro del mismo día.')
      seleccion.value = { dia: null, inicio: null, fin: null }
      return
    }
    seleccion.value.fin = hora
    const [hi, hf] = [seleccion.value.inicio, seleccion.value.fin].sort()
    const nueva = { diaSemana: dia, horaInicio: hi, horaFin: hf }
    const conflicto = props.jornadas.some(j => {
      if (j.diaSemana !== dia) return false
      return !(hf <= j.horaInicio || hi >= j.horaFin)
    })
    if (conflicto) {
      alert('Este rango se cruza con otro ya existente.')
      seleccion.value = { dia: null, inicio: null, fin: null }
      return
    }
    const confirmado = await dialogoConfirmacion.value.abrir()
    if (confirmado) {
      emit('nuevo-rango', nueva)
    }
    seleccion.value = { dia: null, inicio: null, fin: null }
  }
}
</script>

<template>
  <div>
    <v-alert
      border="start"
      variant="elevated"
      elevation="2"
      color="blue darken-3"
      text-color="white"
      class="mb-4"
      v-if="!seleccion.inicio"
    >
      Haz clic en una celda para iniciar un rango.
    </v-alert>

    <v-alert
      border="start"
      variant="elevated"
      elevation="2"
      color="orange darken-2"
      text-color="black"
      class="mb-4"
      v-else-if="seleccion.inicio && !seleccion.fin"
    >
      Selecciona una segunda celda en el mismo día para terminar el rango.
    </v-alert>

    <table class="calendario-jornadas" border="1" cellspacing="0" cellpadding="4">
      <thead>
        <tr>
          <th>Hora</th>
          <th v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="hora in horas" :key="hora">
          <td><strong>{{ hora }}</strong></td>
          <td
            v-for="dia in diasSemana"
            :key="dia"
            :class="{
              marcado: props.jornadas.some(j => j.diaSemana === dia && estaEnRango(hora, j.horaInicio, j.horaFin)),
              seleccionado: dia === seleccion.dia && (hora === seleccion.inicio || hora === seleccion.fin)
            }"
            @click="seleccionarCelda(dia, hora)"
          ></td>
        </tr>
      </tbody>
    </table>

    <ConfirmDialog
      ref="dialogoConfirmacion"
      :titulo="'Horario Clases'"
      :mensaje="'¿Estás seguro que deseas agregar el rango?'"
    />
  </div>
</template>

<style scoped>
.calendario-jornadas {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-family: Arial, sans-serif;
}
.calendario-jornadas th {
  background-color: #1976d2;
  color: white;
  position: sticky;
  top: 0;
}
.calendario-jornadas td {
  height: 40px;
  cursor: pointer;
}
.calendario-jornadas td.marcado {
  background-color: #4caf50;
}
.calendario-jornadas td.seleccionado {
  background-color: #ffc107;
}
</style>
