<script setup lang="ts">
import { defineProps } from 'vue'
import { type Event } from '@/type'

const props = defineProps<{ event: Event }>()
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Medal Details for {{ event.name }}</h2>

    <h3 class="text-xl font-semibold mt-4 mb-2">Until 2024</h3>
    <div class="mb-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border border-gray-300 text-center">Sport</th>
            <th class="p-2 border border-gray-300 text-center">Gold</th>
            <th class="p-2 border border-gray-300 text-center">Silver</th>
            <th class="p-2 border border-gray-300 text-center">Bronze</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="sport in event.medals_by_sport?.until_2024?.sports || []"
            :key="sport.name"
          >
            <td class="p-2 border border-gray-300 text-center font-semibold">
              {{ sport.name }}
            </td>
            <td
              class="p-2 border border-gray-300 text-center"
              data-label="Gold"
            >
              {{ sport.gold }}
            </td>
            <td
              class="p-2 border border-gray-300 text-center"
              data-label="Silver"
            >
              {{ sport.silver }}
            </td>
            <td
              class="p-2 border border-gray-300 text-center"
              data-label="Bronze"
            >
              {{ sport.bronze }}
            </td>
          </tr>

          <tr class="font-semibold bg-gray-100">
            <td class="p-2 border border-gray-300 text-center">Total</td>
            <td
              class="p-2 border border-gray-300 text-center"
              data-label="Total Gold"
            >
              {{ event.medals_by_sport?.until_2024?.total?.gold || 0 }}
            </td>
            <td
              class="p-2 border border-gray-300 text-center"
              data-label="Total Silver"
            >
              {{ event.medals_by_sport?.until_2024?.total?.silver || 0 }}
            </td>
            <td
              class="p-2 border border-gray-300 text-center"
              data-label="Total Bronze"
            >
              {{ event.medals_by_sport?.until_2024?.total?.bronze || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Center text for larger screens */
td {
  text-align: center;
}

/* Card layout for small screens */
@media (max-width: 430px) {
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
    color: black; /* Ensuring text is black in mobile */
  }

  td::before {
    content: attr(data-label); /* Labels for each item */
    font-weight: bold;
    color: black; /* Change to black for better visibility */
    display: block; /* Display labels above the values */
  }

  /* Hide data labels in larger screens */
  @media (min-width: 768px) {
    td::before {
      display: none; /* Hide labels for larger screens */
    }
  }
}
</style>
