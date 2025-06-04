<template>
  <v-app>
    <MenuIzquierdo />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import MenuIzquierdo from '~/components/ui/MenuIzquierdo.vue';
</script>
