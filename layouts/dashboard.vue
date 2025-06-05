<template>
  <v-app>
    <MenuIzquierdo />
    <Toast ref="toastRef" />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import MenuIzquierdo from '~/components/ui/MenuIzquierdo.vue';
import Toast from '@/components/ui/Toast.vue'

const toastRef = ref()

provide('toast', toastRef)
</script>
