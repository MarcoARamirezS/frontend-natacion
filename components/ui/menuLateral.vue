<template>
  <v-navigation-drawer app permanent>
    <v-list>
      <v-list-item
        title="Dashboard"
        to="/dashboard"
        prepend-icon="mdi-view-dashboard"
        :active="$route.path === '/dashboard'"
        link
      />
      <v-list-item
        title="Usuarios"
        to="/dashboard/users"
        prepend-icon="mdi-account-group"
        :active="$route.path === '/dashboard/users'"
        link
      />
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
const { logout } = useAuth()
</script>
