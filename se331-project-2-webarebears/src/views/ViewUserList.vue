<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">User List</h1>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">First Name</th>
            <th class="px-4 py-2 border">Last Name</th>
            <th class="px-4 py-2 border">Username</th>
            <th class="px-4 py-2 border">Email</th>
            <th class="px-4 py-2 border">Roles</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="text-center">
            <td class="border px-4 py-2">{{ user.id }}</td>
            <td class="border px-4 py-2">{{ user.firstname }}</td>
            <td class="border px-4 py-2">{{ user.lastname }}</td>
            <td class="border px-4 py-2">{{ user.username }}</td>
            <td class="border px-4 py-2">{{ user.email }}</td>
            <td class="border px-4 py-2">{{ user.roles.join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import apiClient from '@/services/AxiosClient';
  
  export default defineComponent({
    name: 'ViewUserList',
    setup() {
      const users = ref([]);
      const authStore = useAuthStore();
  
      onMounted(async () => {
        try {
          const response = await apiClient.get('/api/users', {
            headers: {
              Authorization: `Bearer ${authStore.token}`
            }
          });
          users.value = response.data;
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      });
  
      return { users };
    }
  });
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  </style>
  