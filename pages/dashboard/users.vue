<script setup>
import usersTable from '@/components/users/usersTable.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})
</script>

<template>
  <v-container
    fluid
    class="pa-0"
    style="margin: 24px 0;"
  >
    <users-table class="w-100" />
  </v-container>
</template>
