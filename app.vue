<template>
  <Toast ref="toastRef" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import Toast from '@/components/ui/Toast.vue'

const toastRef = ref()
provide('toast', toastRef)
</script>
