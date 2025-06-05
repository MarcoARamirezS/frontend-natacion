<template>
  <v-container
    class="d-flex justify-center align-center pa-0 ma-0"
    style="height: 100vh"
    fluid
  >
    <v-sheet color="#E0F7FA" class="d-flex justify-center align-center" height="100%" width="100%">
      <v-card class="pa-5" width="400">
        <v-card-title class="text-center">Iniciar Sesión</v-card-title>
        <v-card-text>
          <v-text-field v-model="usuario" label="Usuario" />
          <v-text-field v-model="password" label="Contraseña" type="password" />
          <v-btn color="primary" block @click="handleLogin">Entrar</v-btn>
        </v-card-text>
      </v-card>
    </v-sheet>
  </v-container>
</template>


<script setup>
import { useToast } from '@/composables/useToast'

definePageMeta({
  middleware: 'guest'
})

const usuario = ref('')
const password = ref('')
const { login } = useAuth()
const { showToast } = useToast()

const handleLogin = async () => {
  try {
    const ok = await login(usuario.value, password.value)

    if (ok) {
      showToast('Inicio de sesión exitoso', 'success')
      return navigateTo('/dashboard')
    } else {
      showToast('Usuario o contraseña incorrectos', 'error')
    }

  } catch (error) {
    // Capturar error personalizado del backend
    const mensaje = error?.response?.data?.error || 'Error inesperado'
    console.error('Error de inicio de sesión:', mensaje)
    showToast(mensaje, 'error')
  }
}

</script>
