<template>
    <div>
      <h2>Profile</h2>
      <div v-if="authStore.user">
        <p>First Name: {{ authStore.user.firstname }}</p>
        <p>Last Name: {{ authStore.user.lastname }}</p>
        <p>Email: {{ authStore.user.email }}</p>
        <p>Username: {{ authStore.user.username }}</p>
        <p>Roles: {{ authStore.user.roles.join(', ') }}</p>
      </div>
      <div v-else>
        <p>Loading user information...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  </script>
  