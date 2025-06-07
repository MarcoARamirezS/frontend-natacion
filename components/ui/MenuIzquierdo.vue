<template>
  <ClientOnly>
    <v-navigation-drawer
      :model-value="drawer"
      app
      :temporary="mobile"
      :permanent="!mobile"
      color="#E0F7FA"
      @update:model-value="$emit('update:drawer', $event)"
    >
      <v-list class="d-flex flex-column h-100">

        <!-- Usuario -->
        <v-list-item class="px-4 pt-4 pb-2">
          <v-row no-gutters align="center">
            <v-col cols="auto">
              <v-avatar :color="avatarColor" size="48">
                <v-icon dark>{{ avatarIcon }}</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <v-list-item-title class="font-weight-bold text-subtitle-1">
                {{ nombreCompleto }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                {{ user?.telefono || 'Sin teléfono' }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-list-item>

        <v-divider />

        <!-- Menú -->
        <template v-for="(item, i) in filteredMenu" :key="i">
          <v-list-item
            v-if="!item.children"
            :title="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            :active="$route.path === item.to"
            link
            @click="closeDrawerOnMobile"
          />

          <v-list-group
            v-else
            :value="openGroups.includes(item.title)"
            :prepend-icon="item.icon"
            no-action
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="item.title" />
            </template>

            <v-list-item
              v-for="(child, j) in item.children"
              :key="j"
              :title="child.title"
              :to="child.to"
              :prepend-icon="child.icon"
              :active="$route.path === child.to"
              link
              @click="closeDrawerOnMobile"
            />
          </v-list-group>
        </template>

        <v-spacer />

        <!-- Cerrar sesión -->
        <v-list-item link class="mb-3" @click="logout">
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </ClientOnly>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  drawer: Boolean,
  mobile: Boolean,
})

const emit = defineEmits(['update:drawer'])

const { logout, user } = useAuth()
const openGroups = ref(['Configuración'])

const closeDrawerOnMobile = () => {
  if (props.mobile) emit('update:drawer', false)
}

const menuItems = [
  {
    title: 'Dashboard',
    to: '/dashboard',
    icon: 'mdi-view-dashboard',
    roles: ['admin', 'coach'],
  },
  {
    title: 'Clases',
    to: '/dashboard/clases',
    icon: 'mdi-school',
    roles: ['admin', 'coach'],
  },
  {
    title: 'Pagos',
    to: '/dashboard/pagos',
    icon: 'mdi-currency-usd',
    roles: ['admin'],
  },
  {
    title: 'Configuración',
    icon: 'mdi-cog',
    roles: ['admin'],
    children: [
      {
        title: 'Usuarios',
        to: '/dashboard/users',
        icon: 'mdi-account-group',
        roles: ['admin'],
      },
      {
        title: 'Sistema',
        to: '/dashboard/sistema',
        icon: 'mdi-account',
        roles: ['admin'],
      },
    ],
  }
]

const avatarIcon = computed(() => {
  const rol = user.value?.rol
  switch (rol) {
    case 'admin': return 'mdi-shield-account'
    case 'coach': return 'mdi-whistle'
    case 'alumno': return 'mdi-school'
    case 'soporte': return 'mdi-lifebuoy'
    case 'asistente': return 'mdi-account-tie'
    default: return 'mdi-account'
  }
})

const avatarColor = computed(() => {
  const rol = user.value?.rol
  switch (rol) {
    case 'admin': return 'deep-purple'
    case 'coach': return 'green'
    case 'alumno': return 'indigo'
    case 'soporte': return 'cyan'
    case 'asistente': return 'amber'
    default: return 'grey'
  }
})

const nombreCompleto = computed(() => {
  const u = user.value || {}
  return `${u.nombre || ''} ${u.apaterno || ''} ${u.amaterno || ''}`.trim()
})

const filteredMenu = computed(() => {
  const role = user.value?.rol
  return menuItems
    .filter(item => item.roles.includes(role))
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child =>
          child.roles.includes(role)
        )
        return { ...item, children: filteredChildren }
      }
      return item
    })
})
</script>
