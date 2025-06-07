<script setup>
import usersTable from '@/components/users/usersTable.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})
</script>

<template>
  <v-container fluid class="ma-3">
    <users-table />
  </v-container>
</template>
