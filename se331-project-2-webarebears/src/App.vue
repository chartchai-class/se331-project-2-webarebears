<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useMessageStore } from './stores/message'
import { storeToRefs } from 'pinia'
import { ref, watch, onBeforeUnmount } from 'vue'
import Navigation from '@/components/Navigation.vue'
import Nav from '@/components/Nav.vue'

const store = useMessageStore()
const { message } = storeToRefs(store)

const flashMessageVisible = ref(false)

let timeoutId: number | undefined

watch(message, (newValue) => {
  if (newValue?.trim()) {
    flashMessageVisible.value = true
    timeoutId = window.setTimeout(() => {
      flashMessageVisible.value = false
      store.resetMessage()
    }, 3000)
  }
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <Nav/>
 
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