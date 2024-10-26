<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useMessageStore } from './stores/message';
import { useAuthStore } from './stores/auth'; // Import the auth store
import { storeToRefs } from 'pinia';
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import Nav from '@/components/Nav.vue';

// Message store setup
const store = useMessageStore();
const { message } = storeToRefs(store);

const authStore = useAuthStore();
authStore.checkAuthStatus();


const flashMessageVisible = ref(false);

let timeoutId: number | undefined;

watch(message, (newValue) => {
  if (newValue?.trim()) {
    flashMessageVisible.value = true;
    timeoutId = window.setTimeout(() => {
      flashMessageVisible.value = false;
      store.resetMessage();
    }, 3000);
  }
});

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});


onMounted(() => {
  authStore.checkAuthStatus(); // Check if the user is authenticated on load
  console.log("User data from authStore on mount:", authStore.user); // Log user data for verification
});

</script>

<template>
  <Nav />
  <div id="layout" class="font-sans text-center text-gray-800">
    <header>
      <div
        v-if="flashMessageVisible"
        class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-yellow-300 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade">
        <h4>{{ message }}</h4>
      </div>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
</style>
