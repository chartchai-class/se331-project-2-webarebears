<script setup lang="ts">
import { ref, onMounted, defineProps, watchEffect } from 'vue'
import { useEventStore } from '@/stores/event'
import { type Event } from '@/type'

const props = defineProps<{ page: number; pageSize: number }>()

const events = ref<Event[]>([])
const eventStore = useEventStore()

function paginateData() {
  if (eventStore.events.length === 0) {
    return;
  }

  const start = (props.page - 1) * props.pageSize
  const end = start + props.pageSize
  events.value = eventStore.events.slice(start, end)
}

onMounted(async () => {
  // Fetch events if not already loaded
  if (eventStore.events.length === 0) {
    await eventStore; 
  }
  paginateData()
})

watchEffect(() => {
  paginateData()
})
</script>

<template>
  <tbody>
    <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
      <td class="px-4 py-2 border text-center">
        <img :src="event.flag_url" alt="Flag" class="w-12 h-auto mx-auto" />
      </td>
      <td class="px-4 py-2 border text-center">
        <RouterLink
          :to="{ name: 'layout-view', params: { id: event.id } }"
          class="text-800 hover:underline"
        >
          {{ event.name }}
        </RouterLink>
      </td>
      <td class="px-4 py-2 border text-center" data-label="Gold">
        {{ event.medals_by_sport?.until_2024?.total?.gold || 0 }}
      </td>
      <td class="px-4 py-2 border text-center" data-label="Silver">
        {{ event.medals_by_sport?.until_2024?.total?.silver || 0 }}
      </td>
      <td class="px-4 py-2 border text-center" data-label="Bronze">
        {{ event.medals_by_sport?.until_2024?.total?.bronze || 0 }}
      </td>
      <td class="px-4 py-2 border text-center" data-label="Total">
        {{ event.total_medals }}
      </td>
    </tr>
  </tbody>
</template>
<style scoped>
/* General styles */
.text-white {
  color: white;
}

/* Card layout for small screens */
@media (max-width: 767px) {
  table {
    display: block;
    width: 100%;
  }

  thead,
  tbody,
  tr,
  th,
  td {
    display: block;
    width: 100%;
  }

  thead {
    display: none; /* Hide headers for mobile */
  }

  tr {
    margin-bottom: 1rem; /* Spacing between cards */
    border: 1px solid #e2e8f0; /* Optional border */
    border-radius: 8px;
    padding: 1rem;
    background-color: #fff;
  }

  td {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    justify-content: center; /* Center vertically */
    align-items: center; /* Center horizontally */
    color: black; /* Ensuring text is black in mobile */
    text-align: center; /* Centering text */
  }

  td::before {
    content: attr(data-label); /* Labels for each item */
    font-weight: bold;
    color: black; /* Change to black for better visibility */
    display: block; /* Display labels above the values */
    margin-bottom: 0.5rem; /* Space between label and value */
  }
}

/* Default hover styles */
tr:hover {
  background-color: white; /* Your hover color */
  color: black; /* Change this to your desired hover text color */
}
</style>
