<template>
  <nav
    :class="{ 'scrolled-nav': scrollPosition }"
    class="fixed top-0 left-0 w-full z-50"
  >
    <!-- desktop -->
    <div class="bg-customYellow">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center">
          <!-- branding -->
          <div class="flex items-center px-12">
            <RouterLink :to="{ name: 'list-view' }">
              <img
                src="@/assets/olympic-games.png"
                alt="Home"
                class="w-20 h-20"
              />
            </RouterLink>
          </div>

          <!-- menu items -->
          <div class="hidden md:flex items-center space-x-5 ml-auto">
            <RouterLink
              to="/login"
              class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium"
              >Login</RouterLink
            >
            <RouterLink
              to="/signup"
              class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium"
              >Sign Up</RouterLink
            >
            <RouterLink
              to="/viewlist"
              class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium"
              >View list(for admin)</RouterLink
            >
            <RouterLink
              to="/contactus"
              class="py-1 text-customDarkBlue border-b border-transparent hover:border-customBlue font-medium"
              >Contact Us</RouterLink
            >
          </div>

          <!-- button show mobile menu -->
          <div class="md:hidden flex items-center">
            <button @click="showMobileMenu = !showMobileMenu" class="py-5 px-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- mobile menu -->
    <div class="md:hidden bg-customYellow" :class="{ hidden: !showMobileMenu }">
      <RouterLink
        to="/login"
        class="block py-2 px-12 hover:bg-white text-customDarkBlue font-medium"
        >Login</RouterLink
      >
      <RouterLink
        to="/signup"
        class="block py-2 px-12 hover:bg-white text-customDarkBlue font-medium"
        >Sign Up</RouterLink
      >
      <RouterLink
        to="/viewlist"
        class="block py-2 px-12 hover:bg-white text-customDarkBlue font-medium"
        >View list(for admin)</RouterLink
      >
      <RouterLink
        to="/contactus"
        class="block py-2 px-12 hover:bg-white text-customDarkBlue font-medium"
        >Contact Us</RouterLink
      >
    </div>
  </nav>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const showMobileMenu = ref(false) // Set to false to hide the menu by default
    return {
      showMobileMenu,
    }
  },
}
</script>

<style scoped>
/* Responsive styles for iPhone 14 Pro Max */
@media (max-width: 430px) {
  .scrolled-nav {
    background-color: #ffd700; /* Change to desired color */
  }

  /* Adjust padding and spacing for mobile */
  .py-5 {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  .px-12 {
    padding-left: 16px;
    padding-right: 16px;
  }

  /* Make sure to adjust font sizes as necessary */
  .text-customDarkBlue {
    font-size: 16px; /* Adjust font size for better readability */
  }

  .text-customDarkBlue.hover\:border-customBlue:hover {
    border-color: #007bff; /* Ensure the hover effect is prominent */
  }

  /* Mobile menu links */
  .block {
    width: 100%; /* Full width for menu items */
    text-align: left; /* Align text to the left */
  }
}
</style>
