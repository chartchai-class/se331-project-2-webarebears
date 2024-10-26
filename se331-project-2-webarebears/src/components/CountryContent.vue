<script setup lang="ts">
import { ref, defineProps, watchEffect } from 'vue'
import type { Event } from '@/type'


const props = defineProps<{ events: Event[]; page: number; pageSize: number }>()
const paginatedEvents = ref<Event[]>([])

watchEffect(() => {
  if (props.events && props.events.length > 0) {
    const start = (props.page - 1) * props.pageSize
    const end = start + props.pageSize
    paginatedEvents.value = props.events.slice(start, end)
  } else {
    paginatedEvents.value = []
  }
})

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
        {{ event.medals_by_sport?.until_2024?.total?.gold || 0 }}
      </td>
      <td class="px-4 py-2 border text-center">
        {{ event.medals_by_sport?.until_2024?.total?.silver || 0 }}
      </td>
      <td class="px-4 py-2 border text-center">
        {{ event.medals_by_sport?.until_2024?.total?.bronze || 0 }}
      </td>
      <td class="px-4 py-2 border text-center">{{ event.total_medals }}</td>
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
