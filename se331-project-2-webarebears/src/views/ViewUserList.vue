<!-- <template>
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
   -->

   <template>
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(", ") }}</td>
            <td>
              <button v-if="!user.roles.includes('ROLE_ADMIN')" @click="upgradeUserToAdmin(user.id)">
                Upgrade to Admin
              </button>
              <button v-if="user.roles.includes('ROLE_ADMIN')" @click="downgradeUserToRegular(user.id)">
                Downgrade to User
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import apiClient from '@/services/AxiosClient';
  
  const users = ref([]);
  
  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/users');
      users.value = response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  const upgradeUserToAdmin = async (id) => {
    try {
      await apiClient.post(`/api/users/${id}/upgrade`);
      await fetchUsers(); // Refresh users list after upgrading
    } catch (error) {
      console.error("Error upgrading user to admin:", error);
    }
  };
  
  const downgradeUserToRegular = async (id) => {
    try {
      await apiClient.post(`/api/users/${id}/downgrade`);
      await fetchUsers(); // Refresh users list after downgrading
    } catch (error) {
      console.error("Error downgrading user to regular:", error);
    }
  };
  
  onMounted(fetchUsers);
  </script>
  