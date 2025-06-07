<template>
  <v-app>
    <!-- Menu lateral con props controladas -->
    <MenuIzquierdo
      :drawer="drawer"
      :mobile="mobile"
      @update:drawer="drawer = $event"
    />

    <!-- Botón flotante para mostrar menú -->
    <v-btn
      v-if="!drawer"
      icon
      color="primary"
      style="position: fixed; top: 16px; left: 16px; z-index: 3000;"
      @click="drawer = true"
    >
      <v-tooltip activator="parent" location="bottom">
        Mostrar menú
      </v-tooltip>
      <v-icon>mdi-menu</v-icon>
    </v-btn>

    <Toast ref="toastRef" />

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import MenuIzquierdo from '~/components/ui/MenuIzquierdo.vue'
import Toast from '@/components/ui/Toast.vue'
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const drawer = ref(true)
const toastRef = ref()
const { mobile } = useDisplay()

provide('toast', toastRef)
</script>
