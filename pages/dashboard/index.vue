<script setup>
import { ref, onMounted, computed } from 'vue'
import ChartCard from '@/components/ui/ChartCard.vue'
import { useAuth } from '@/composables/useAuth'

const axios = useNuxtApp().$axios

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { token } = useAuth()
const usuariosPorRol = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('/dashboard/usuarios-por-rol', {
      headers: { Authorization: `Bearer ${token.value}` },
    })

    // Transforma el objeto plano en un arreglo
    usuariosPorRol.value = Object.entries(res.data)
      .filter(([rol, cantidad]) => cantidad > 0) // Opcional
      .map(([rol, cantidad]) => ({ rol, cantidad }))
  } catch (error) {
    console.error('Error al cargar los usuarios por rol:', error)
  }
})

const labels = computed(() => usuariosPorRol.value.map(u => u.rol))
const values = computed(() => usuariosPorRol.value.map(u => u.cantidad))
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">Bienvenido al Dashboard</h1>

    <v-row>
      <v-col cols="12" md="6">
        <ChartCard
          v-if="usuariosPorRol.length"
          title="Usuarios por Rol"
          subtitle="Distribución de usuarios según su rol"
          :labels="labels"
          :values="values"
          type="bar"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
