<template>
  <v-container
    class="d-flex justify-center align-center"
    style="height: 100vh"
    fluid
  >
    <v-card class="pa-5" width="400">
      <v-card-title class="text-center">Iniciar Sesión</v-card-title>
      <v-card-text>
        <v-text-field v-model="usuario" label="Usuario" />
        <v-text-field v-model="password" label="Contraseña" type="password" />
        <v-btn color="primary" block @click="handleLogin">Entrar</v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})

const usuario = ref('')
const password = ref('')
const { login } = useAuth()

const handleLogin = async () => {
  const ok = await login(usuario.value, password.value)
  if (ok) {
    return navigateTo('/dashboard')
  } else {
    alert('Usuario o contraseña incorrectos')
  }
}
</script>

