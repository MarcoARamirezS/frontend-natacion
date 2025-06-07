<template>
  <v-card class="pa-4" :max-width="maxWidth">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
    <v-card-text>
      <div class="chart-wrapper">
        <component
          :is="chartComponent"
          :data="chartData"
          :options="options"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import {
  Bar,
  Pie,
  Doughnut,
  Line
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
)

const props = defineProps({
  title: String,
  subtitle: String,
  type: {
    type: String,
    default: 'bar'
  },
  labels: {
    type: Array,
    required: true
  },
  values: {
    type: Array,
    required: true
  },
  colors: {
    type: Array,
    default: () => [
      '#42A5F5', '#66BB6A', '#FFA726',
      '#AB47BC', '#FF7043', '#26A69A'
    ]
  },
  maxWidth: {
    type: String,
    default: '100%'
  }
})

const chartComponent = computed(() => {
  switch (props.type) {
    case 'pie': return Pie
    case 'doughnut': return Doughnut
    case 'line': return Line
    default: return Bar
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    label: props.title,
    data: props.values,
    backgroundColor: props.colors
  }]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false
}
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 300px;
}
</style>
