<script setup lang="ts">
import { ref, defineProps, watchEffect } from 'vue'
import type { Event } from '@/type'
import apiClient from '@/services/AxiosClient'
import { useMessageStore } from '@/stores/message'
import { useEventStore } from '@/stores/event'
import { useAuthStore } from '@/stores/auth';

const messageStore = useMessageStore()
const eventStore = useEventStore()
const authStore = useAuthStore();

const props = defineProps<{ events: Event[]; page: number; pageSize: number }>()
const paginatedEvents = ref<Event[]>([])

watchEffect(() => {
  if (props.events && props.events.length > 0) {
    const sortedEvents = [...props.events].sort((a, b) => (b.total_medals || 0) - (a.total_medals || 0))
    const start = (props.page - 1) * props.pageSize
    const end = start + props.pageSize
    paginatedEvents.value = sortedEvents.slice(start, end)
  } else {
    paginatedEvents.value = []
  }
})

async function deleteEvent(id: string) {
  if (!authStore.isAdmin) {
    messageStore.updateMessage('Unauthorized action. Admins only.');
    return;
  }
  try {
    await apiClient.delete(`/api/countries/${id}`)
    messageStore.updateMessage('Event deleted successfully!')
    await eventStore.fetchAllEvents()
  } catch (error) {
    console.error('Failed to delete event:', error)
    messageStore.updateMessage('Failed to delete event.')
  }
}
</script>

<template>
  <tbody>
    <tr
      v-for="event in paginatedEvents"
      :key="event.id"
      class="text-white hover:bg-gray-50 hover:text-black"
    >
      <td class="px-4 py-2 border text-center">
        <img :src="event.flag_url" alt="Flag" class="w-12 h-auto mx-auto" />
      </td>
      <td class="px-4 py-2 border">
        <RouterLink
          :to="{ name: 'layout-view', params: { id: event.id } }"
          class="text-600 hover:underline"
        >
          {{ event.name }}
        </RouterLink>
      </td>
      <td class="px-4 py-2 border text-center">
        {{ event.gold_medals || 0 }}
      </td>
      <td class="px-4 py-2 border text-center">
        {{ event.silver_medals || 0 }}
      </td>
      <td class="px-4 py-2 border text-center">
        {{ event.bronze_medals || 0 }}
      </td>
      <td class="px-4 py-2 border text-center">{{ event.total_medals }}</td>
      <td class="px-4 py-2 border text-center" v-if="authStore.isAdmin">
        <button 
          @click="deleteEvent(event.id)" 
          class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </td>
    </tr>
  </tbody>
</template>

<style scoped>
.text-white {
  color: white;
}

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
    display: none;
  }

  tr {
    margin-bottom: 1rem; 
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    background-color: #fff;
  }

  td {
    padding: 0.5rem 0;
    display: flex;
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    color: black; 
    text-align: center; 
  }

  td::before {
    content: attr(data-label); 
    font-weight: bold;
    color: black;
    display: block; 
    margin-bottom: 0.5rem; 
  }
}

tr:hover {
  background-color: white; 
  color: black; 
}
</style>