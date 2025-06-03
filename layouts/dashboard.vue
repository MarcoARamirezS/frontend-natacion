<template>
  <v-app>
    <menu-lateral />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import menuLateral from '@/components/ui/menuLateral.vue'
</script>
