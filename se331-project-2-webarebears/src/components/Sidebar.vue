<template>
  <header :class="{'scrolled-nav': scrollPosition}" class="header">
    <nav class="nav">
      <div class="branding">
        <RouterLink :to="{ name: 'list-view' }" >
          <img src="@/assets/olympic-games.png" alt="Home" class="w-20 h-20" />
        </RouterLink>
      </div>
      <!-- Desktop Navigation -->
      <ul v-show="!mobile" class="navigation">
        <li>
          <RouterLink to="/login" class="link">
            Login
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/signup" class="link">
            Sign Up
          </RouterLink>
        </li>
      </ul>
      <!-- Mobile Icon -->
      <div class="icon">
        <i @click="toggleMobileNav" v-show="mobile" class="far fa-bars" :class="{'icon-active': mobileNav}"></i>
      </div>
      <!-- Mobile Dropdown Navigation -->
      <transition name="mobile-nav">
        <ul v-show="mobileNav" class="dropdown-nav">
          <li>
            <RouterLink to="/login" class="link text-gray-800 hover:text-green-500 transition">
              Login
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/signup" class="link text-gray-800 hover:text-green-500 transition">
              Sign Up
            </RouterLink>
          </li>
        </ul>
      </transition>
    </nav>
  </header>
</template>

<script>
export default {
  name: "navigation",
  data() {
    return {
      scrollPosition: null,
      mobile: false, // Corrected typo
      mobileNav: null,
      windowWidth: null,
    };
  },
  methods: {
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav;
    },
  },
};
</script>

<style scoped>
.header {
  background-color: white;
  z-index: 99;
  width: 100%;
  position: fixed;
  height: 80px; /* Set a fixed height for the navbar */
  line-height: 80px; /* Center the content vertically */
  transition: 0.5s ease all;
  top: 0; 
  left: 0; 
  margin:0 ; 
  padding: 0; 
  color: white;
}

.header .nav {
  display: flex;
  flex-direction: row;
  padding: 0 0;
  transition: 0.5s ease all;
  width: 90%;
  margin: 0 auto;
}

@media (min-width: 1140px) {
  .header .nav {
    max-width: 1140px;
  }
}

.header .nav ul,
.header .nav .link {
  font-weight: 500;
  color: black;
  list-style: none;
  text-decoration: none;
}

.header .nav li {
  text-transform: uppercase;
  padding: 16px;
  margin-left: 16px;
}

.header .nav .link {
  font-size: 14px;
  transition: 0.5s ease all;
  padding-bottom: 4px;
  border-bottom: 1px solid transparent;
}

.header .nav .link:hover {
  color: #00afea;
  border-color: #00afea;
}

.header .branding {
  display: flex;
  align-items: center;
}

.branding img {
  width: 80px;
  height: 80px;
  transition: 0.5s ease all;

}

.navigation {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.icon {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 24px;
  height: 100%;
}

.icon i {
  cursor: pointer;
  font-size: 24px;
  transition: 0.8s ease all;
}

.icon-active {
  transform: rotate(180deg);
}
</style>
