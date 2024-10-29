<template>
  <div class="profile-container ">
    <h2 class="profile-title">Profile</h2>
    <div v-if="authStore.user" class="user-info">
      <p><strong>First Name:</strong> {{ authStore.user.firstname }}</p>
      <p><strong>Last Name:</strong> {{ authStore.user.lastname }}</p>
      <p><strong>Email:</strong> {{ authStore.user.email }}</p>
      <p><strong>Username:</strong> {{ authStore.user.username }}</p>
      <p><strong>Roles:</strong> {{ authStore.user.roles.join(', ') }}</p>
    </div>
    <div v-else class="loading-message">
      <p><span class="spinner"></span> Loading user information...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 100px;
}

.profile-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #2c3e50; 
}

.user-info p {
  margin: 0.5rem 0;
  color: #34495e; 
  font-size: 1rem;
  line-height: 1.6;
}

.user-info strong {
  font-weight: bold;
  color: #2c3e50;
}

.loading-message {
  font-style: italic;
  color: #888;
  text-align: center;
  margin-top: 1.5rem;
}

/* Loading Spinner Style */
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
