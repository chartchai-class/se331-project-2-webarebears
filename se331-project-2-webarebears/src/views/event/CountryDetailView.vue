<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import EventService from '@/services/Service'
import { useEventStore } from '@/stores/event'
import type { Country, Event } from '@/type'

const route = useRoute()
const country = ref<Country | null>(null)
const error = ref<string | null>(null)
const events = ref<Event[]>([])
const eventStore = useEventStore()

// This will hold the specific event with a flag matching the country
const selectedEvent = ref<Event | null>(null)

// Load country and events data on mount
onMounted(async () => {
  try {
    const id = route.params.id as string
    country.value = await EventService.getCountry(id)
  } catch (err) {
    error.value = (err as Error).message
  }

  // Fetch events if not already loaded
  if (eventStore.events.length === 0) {
    await eventStore
  }
  paginateData()

  // Find the event that matches the country ID
  if (country.value) {
    selectedEvent.value =
      eventStore.events.find(event => event.id === country.value?.id) || null
  }
})

// Function to paginate events
function paginateData() {
  if (eventStore.events.length === 0) return

  const page = 1 // Set default page number
  const pageSize = 10 // Set default page size

  const start = (page - 1) * pageSize
  const end = start + pageSize
  events.value = eventStore.events.slice(start, end)
}

// Watch for changes in eventStore data and update events
watchEffect(() => {
  paginateData()
})
</script>

<template>
  <div>
    <h2 class="font-semibold pb-2">Country Details</h2>

    <div v-if="country">
      <!-- Display only the flag for the specific selected event -->
      <div class="flex justify-center mb-4">
        <img
          v-if="selectedEvent"
          :src="selectedEvent.flag_url"
          alt="Flag"
          class="max-w-full h-auto" 
        />
      </div>
      <p>Country Name: {{ country.name }}</p>
      <p class="pb-2">Description: {{ country.description }}</p>
      <p v-if="country.hostcountry">Host country: {{ country.hostcountry }}</p>
    </div>

    <div v-if="error" class="text-red-500">{{ error }}</div>
  </div>
</template>
