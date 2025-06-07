<script setup>
import { ref } from 'vue'

const props = defineProps({
  jornadas: {
    type: Array,
    required: true,
  },
})

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

// Horas de 7:00 a 22:00
const horas = []
for (let h = 7; h <= 22; h++) {
  horas.push(`${h.toString().padStart(2, '0')}:00`)
}

// Función para saber si hora actual está dentro del rango (horaInicio, horaFin)
function estaEnRango(hora, horaInicio, horaFin) {
  // Convertimos a minutos para comparar
  const toMin = (horaStr) => {
    const [h, m] = horaStr.split(':').map(Number)
    return h * 60 + m
  }
  const horaMin = toMin(hora)
  const inicioMin = toMin(horaInicio)
  const finMin = toMin(horaFin)
  return horaMin >= inicioMin && horaMin < finMin
}
</script>

<template>
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
        <td v-for="dia in diasSemana" :key="dia"
            :class="{
              'marcado': props.jornadas.some(j => 
                j.diaSemana.toLowerCase() === dia.toLowerCase() && 
                estaEnRango(hora, j.horaInicio, j.horaFin)
              )
            }"
        ></td>
      </tr>
    </tbody>
  </table>
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
  width: 12.5%; /* 8 columnas aprox */
  border: 1px solid #ccc;
}
.calendario-jornadas td.marcado {
  background-color: #4caf50; /* verde */
}
</style>
