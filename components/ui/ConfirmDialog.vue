<template>
  <v-dialog v-model="dialog" max-width="500" transition="dialog-transition" persistent>
    <v-card class="pa-4">
      <v-card-title class="text-h6 justify-center text-center">
        {{ titulo }}
      </v-card-title>

      <v-card-text class="text-body-1 text--secondary text-center mt-2">
        {{ mensaje }}
      </v-card-text>

      <v-card-actions class="justify-end mt-4">
        <v-btn variant="text" style="color: #00008B;" @click="cancelar">
          Cancelar
        </v-btn>
        <v-btn variant="elevated" color="primary" @click="confirmar">
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const props = defineProps({
  titulo: {
    type: String,
    default: 'Confirmar acción',
  },
  mensaje: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['confirmado'])

const dialog = ref(false)
let resolvePromise = null

function abrir() {
  dialog.value = true
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

function confirmar() {
  dialog.value = false
  resolvePromise(true)
  emit('confirmado')
}

function cancelar() {
  dialog.value = false
  resolvePromise(false)
}

defineExpose({ abrir })
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
</style>
