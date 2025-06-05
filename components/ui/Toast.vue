<template>
  <v-snackbar v-model="visible" :timeout="timeout" :color="color" location="top right">
    <v-icon class="me-2">{{ icon }}</v-icon>
    {{ message }}
  </v-snackbar>
</template>

<script setup>
const visible = ref(false)
const message = ref('')
const timeout = ref(3000)
const type = ref('success')

// Mostrar Toast
const showToast = (msg, newType = 'success', time = 3000) => {
  message.value = msg
  type.value = newType
  timeout.value = time
  visible.value = true
}

const colorMap = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue'
}

const iconMap = {
  success: 'mdi-check-circle',
  error: 'mdi-alert-circle',
  warning: 'mdi-alert',
  info: 'mdi-information'
}

const color = computed(() => colorMap[type.value] || 'info')
const icon = computed(() => iconMap[type.value] || 'mdi-information')

defineExpose({ showToast })
</script>
