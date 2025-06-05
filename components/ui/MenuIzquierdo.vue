<template>
  <v-navigation-drawer app permanent color="#E0F7FA">
    <v-list class="d-flex flex-column h-100">
      <template v-for="(item, i) in filteredMenu" :key="i">
        <v-list-item
          v-if="!item.children"
          :title="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :active="$route.path === item.to"
          link
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
          />
        </v-list-group>
      </template>

      <v-spacer />

      <v-list-item
        title="Salir"
        prepend-icon="mdi-logout"
        link
        @click="logout"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
const { logout, user } = useAuth()

const openGroups = ref(['Configuración'])

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
        title: 'Perfil',
        to: '/dashboard/perfil',
        icon: 'mdi-account',
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Perfil',
    to: '/dashboard/perfil',
    icon: 'mdi-account',
    roles: ['coach'],
  },
]

const filteredMenu = computed(() => {
  const role = user.value?.rol
  console.log('@@@ role => ', user)
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
