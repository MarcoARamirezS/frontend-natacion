<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { token } = useAuth()
const users = ref([])

const fetchUsers = async () => {
  try {
    const res = await useNuxtApp().$axios.get('/users', {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    users.value = res.data
  } catch (err) {
    console.error(err)
    alert('Error al cargar usuarios')
  }
}

onMounted(fetchUsers)
</script>

<template>
  <v-container>
    <h2 class="text-h5 mb-4">Usuarios</h2>
    <v-data-table :headers="headers" :items="users" class="elevation-1" />
  </v-container>
</template>

<script setup>
const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Apellido Paterno', key: 'apaterno' },
  { title: 'Apellido Materno', key: 'amaterno' },
  { title: 'Usuario', key: 'usuario' },
  { title: 'Rol', key: 'rol' },
]
</script>
