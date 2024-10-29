<template>
  <div class="user-management-container">
  <h1 class="title">User Management</h1>
  <div class="user-table">
  <div
          v-for="user in users"
          :key="user.id"
          class="user-row"
  >
  <div class="user-info">
  <strong>Username:</strong>
  <span>{{ user.username }}</span>
  </div>
  <div class="user-info">
  <strong>Email:</strong>
  <span>{{ user.email }}</span>
  </div>
  <div class="user-info">
  <strong>Roles:</strong>
  <span>{{ user.roles.join(", ") }}</span>
  </div>
  <div class="user-actions">
  <button
              v-if="!user.roles.includes('ROLE_ADMIN')"
              @click="upgradeUserToAdmin(user.id)"
              class="action-button upgrade-button"
  >
              Upgrade to Admin
  </button>
  <button
              v-if="user.roles.includes('ROLE_ADMIN')"
              @click="downgradeUserToRegular(user.id)"
              class="action-button downgrade-button"
  >
              Downgrade to User
  </button>
  </div>
  </div>
  </div>
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
   
  <style scoped>
  .user-management-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: Arial, sans-serif;
    margin-top: 100px;
  }
   
  .title {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }
   
  /* Desktop view */
  .user-table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
   
  .user-row {
    display: table-row;
  }
   
  .user-info, .user-actions {
    display: table-cell;
    padding: 0.75rem;
    border-bottom: 1px solid #ddd;
    color: #34495e;
  }
   
  .user-actions {
    text-align: right;
  }
   
  .user-info strong {
    font-weight: bold;
  }
   
  /* Mobile view */
  @media (max-width: 600px) {
    .user-table {
      display: block;
    }
   
    .user-row {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 0.75rem;
    }
   
    .user-info, .user-actions {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
    }
   
    .user-actions {
      flex-direction: column;
      text-align: left;
    }
  }
   
  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #fff;
    margin-right: 0.5rem;
    transition: background-color 0.3s ease;
  }
   
  .upgrade-button {
    background-color: #27ae60;
  }
   
  .upgrade-button:hover {
    background-color: #2ecc71;
  }
   
  .downgrade-button {
    background-color: #e74c3c;
  }
   
  .downgrade-button:hover {
    background-color: #c0392b;
  }
  </style>
  
  has context menu