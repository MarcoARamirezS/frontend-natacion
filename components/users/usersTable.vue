<template>
  <v-container class="ma-3">
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
    />

    <v-data-table
      :headers="headers"
      :items="filteredUsers"
      class="elevation-1"
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
          :disabled="item.rol === 'admin'"
          style="margin-left: 10px !important;"
          @click="openDeleteDialog(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Diálogo Crear/Editar Usuario -->
    <v-dialog v-model="editDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-icon class="me-2">{{ isCreating ? 'mdi-account-plus' : 'mdi-pencil' }}</v-icon>
          {{ isCreating ? 'Crear Usuario' : 'Editar Usuario' }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="6"><v-text-field v-model="selectedUser.nombre" label="Nombre" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.apaterno" label="Apellido Paterno" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.amaterno" label="Apellido Materno" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.direccion" label="Dirección" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.telefono" label="Teléfono" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.ciudad" label="Ciudad" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.estado" label="Estado" /></v-col>
              <v-col cols="6"><v-text-field v-model="selectedUser.usuario" label="Usuario" /></v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="selectedUser.password"
                  label="Contraseña"
                  type="password"
                  :rules="[v => !isCreating || v.length >= 8 || 'Mínimo 8 caracteres']"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="selectedUser.rol"
                  label="Rol"
                  :items="roles"
                  item-value="value"
                  item-title="text"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="editDialog = false">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="isCreating ? createUser() : saveEdit()">
            <v-icon start>{{ isCreating ? 'mdi-check' : 'mdi-content-save' }}</v-icon>
            {{ isCreating ? 'Crear' : 'Guardar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo Confirmar Borrado -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon class="me-2">mdi-delete-alert</v-icon>
          ¿Eliminar usuario?
        </v-card-title>
        <v-card-text>
          Esta acción no se puede deshacer. ¿Eliminar a
          <strong>{{ selectedUser.nombre }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">
            <v-icon start>mdi-close</v-icon>
            Cancelar
          </v-btn>
          <v-btn color="red" @click="confirmDelete">
            <v-icon start>mdi-delete</v-icon>
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
