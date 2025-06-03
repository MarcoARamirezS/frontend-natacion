<script setup>
import usersTable from '@/components/users/usersTable.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})
</script>

<template>
  <users-table /> 
</template>
