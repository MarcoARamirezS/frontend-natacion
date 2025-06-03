<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Bienvenido al Dashboard</h1>
    <p>Selecciona una opción del menú</p>
  </v-container>
</template>
