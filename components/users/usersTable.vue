<template>
  <v-container class="pa-0 ma-5" fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <h2 class="text-h5">Usuarios</h2>
      <v-btn color="primary" @click="openCreateDialog">
        <v-icon start>mdi-account-plus</v-icon>
        Crear Usuario
      </v-btn>
    </div>

    <v-text-field
      v-model="search"
      label="Buscar por nombre"
      append-inner-icon="mdi-magnify"
      class="mb-3"
      clearable
      hide-details
    />

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      class="elevation-1 w-100"
      :items-per-page="5"
    >
      <template #item.actions="{ item }">
        <v-btn
          icon
          size="small"
          :disabled="item.rol === 'admin'"
          @click="openEditDialog(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          icon
          size="small"
          color="red"
          class="ml-2"
          :disabled="item.rol === 'admin'"
          @click="openDeleteDialog(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Diálogos omitidos para brevedad -->
  </v-container>
</template>

<script setup>
import { useToast } from '@/composables/useToast'
const { token } = useAuth()
const axios = useNuxtApp().$axios

const users = ref([])
const search = ref('')
const editDialog = ref(false)
const deleteDialog = ref(false)
const isCreating = ref(false)
const selectedUser = ref({})
const { showToast } = useToast()

const roles = [
  { text: 'admin', value: 'admin' },
  { text: 'asistente', value: 'asistente' },
  { text: 'coach', value: 'coach' },
  { text: 'alumno', value: 'alumno' },
  { text: 'soporte', value: 'soporte' },
]

const headers = [
  { title: 'Nombre', key: 'nombre' },
  { title: 'Apellido Paterno', key: 'apaterno' },
  { title: 'Apellido Materno', key: 'amaterno' },
  { title: 'Usuario', key: 'usuario' },
  { title: 'Rol', key: 'rol' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const fetchUsers = async () => {
  try {
    const res = await axios.get('/users', {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    users.value = res.data
  } catch (err) {
    console.error(err)
    showToast('Error al cargar usuarios', 'error')
  }
}

const filteredUsers = computed(() =>
  users.value.filter((u) =>
    u.nombre.toLowerCase().includes(search.value.toLowerCase())
  )
)

const openEditDialog = (item) => {
  selectedUser.value = { ...item }
  isCreating.value = false
  editDialog.value = true
}

const openCreateDialog = () => {
  selectedUser.value = {
    nombre: '',
    apaterno: '',
    amaterno: '',
    direccion: '',
    telefono: '',
    ciudad: '',
    estado: '',
    usuario: '',
    password: '',
    rol: 'asistente',
  }
  isCreating.value = true
  editDialog.value = true
}

const openDeleteDialog = (item) => {
  selectedUser.value = item
  deleteDialog.value = true
}

const saveEdit = async () => {
  try {
    await axios.put(`/users/${selectedUser.value.id}`, selectedUser.value, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    showToast('Usuario actualizado correctamente', 'success')
    editDialog.value = false
    await fetchUsers()
  } catch (err) {
    console.error(err)
    showToast('Error al guardar cambios', 'error')
  }
}

const createUser = async () => {
  if (selectedUser.value.password.length < 8) {
    showToast('La contraseña debe tener al menos 8 caracteres', 'error')
    return
  }

  try {
    await axios.post('/users', selectedUser.value, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    showToast('Usuario creado correctamente', 'success')
    editDialog.value = false
    await fetchUsers()
  } catch (err) {
    console.error(err)
    showToast('Error al crear usuario', 'error')
  }
}

const confirmDelete = async () => {
  try {
    await axios.delete(`/users/${selectedUser.value.id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
    showToast('Usuario eliminado correctamente', 'success')
    deleteDialog.value = false
    await fetchUsers()
  } catch (err) {
    console.error(err)
    showToast('Error al eliminar usuario', 'error')
  }
}

onMounted(fetchUsers)
</script>
