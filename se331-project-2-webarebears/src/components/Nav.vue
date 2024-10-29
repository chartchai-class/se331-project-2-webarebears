<template>
  <nav :class="{ 'scrolled-nav': scrollPosition }" class="fixed top-0 left-0 w-full z-50">
    <div class="bg-customYellow">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center">
          <div class="flex items-center px-12">
            <RouterLink :to="{ name: 'list-view' }">
              <img src="@/assets/olympic-games.png" alt="Home" class="w-20 h-20" />
            </RouterLink>
          </div>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center space-x-5 ml-auto">
            <template v-if="authStore.isAuthenticated">
              <RouterLink to="/profile" class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Profile</RouterLink>
              <button @click="logout" class="py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600">
                Logout
              </button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Login</RouterLink>
              <RouterLink to="/signup" class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Sign Up</RouterLink>
            </template>
            <RouterLink v-if="authStore.isAdmin" to="/viewlist" class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">View list</RouterLink>
            <RouterLink to="/contactus" class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Contact Us</RouterLink>
          </div>

          <!-- Button to Show Mobile Menu -->
          <div class="md:hidden flex items-center">
            <button @click="showMobileMenu = !showMobileMenu" class="py-5 px-8">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden bg-customYellow px-12 py-4">
          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/profile" class="block py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Profile</RouterLink>
            <button @click="logout" class="block w-full text-left py-1 text-red-500 font-medium">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="block py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Login</RouterLink>
            <RouterLink to="/signup" class="block py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Sign Up</RouterLink>
          </template>
          <RouterLink v-if="authStore.isAdmin" to="/viewlist" class="block py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">View list</RouterLink>
          <RouterLink to="/contactus" class="block py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium">Contact Us</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const showMobileMenu = ref(false)
    const authStore = useAuthStore()
    const router = useRouter()

    const logout = () => {
      authStore.logout()
      router.push({ name: 'login' })
    }

    return {
      showMobileMenu,
      authStore,
      logout,
    }
  },
}
</script>

<style scoped>
/* Responsive styles for iPhone 14 Pro Max */
@media (max-width: 430px) {
  .scrolled-nav {
    background-color: #ffd700;
  }

  .py-5 {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .px-12 {
    padding-left: 16px;
    padding-right: 16px;
  }

  .text-customDarkBlue {
    font-size: 16px;
  }

  .text-customDarkBlue.hover\:border-customBlue:hover {
    border-color: #007bff;
  }
}
</style>
