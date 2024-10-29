<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
import { type Event } from '@/type';
import { useAuthStore } from '@/stores/auth';
 
const props = defineProps<{ event: Event }>();
const authStore = useAuthStore();
const showUpdateButtons = ref(false);
const showAddSportForm = ref(false);
 
const newSportName = ref('');
const newSportGold = ref(0);
const newSportSilver = ref(0);
const newSportBronze = ref(0);
 
const isAdmin = computed(() => authStore.isAdmin);
 
const toggleUpdateButtons = () => {
  showUpdateButtons.value = !showUpdateButtons.value;
};
 
const toggleAddSportForm = () => {
  showAddSportForm.value = !showAddSportForm.value;
};
 
const calculateTotals = () => {
  const sports = props.event.medals_by_sport?.until_2024?.sports || [];
  const totalGold = sports.reduce((total, sport) => total + sport.gold, 0);
  const totalSilver = sports.reduce((total, sport) => total + sport.silver, 0);
  const totalBronze = sports.reduce((total, sport) => total + sport.bronze, 0);
 
  props.event.gold_medals = totalGold;
  props.event.silver_medals = totalSilver;
  props.event.bronze_medals = totalBronze;
  props.event.total_medals = totalGold + totalSilver + totalBronze;
};
 
const addSport = async () => {
  const newSport = {
    name: newSportName.value,
    gold: newSportGold.value,
    silver: newSportSilver.value,
    bronze: newSportBronze.value,
  };
 
  if (!props.event.medals_by_sport.until_2024.sports) {
    props.event.medals_by_sport.until_2024.sports = [];
  }
 
  props.event.medals_by_sport.until_2024.sports.push(newSport);
  calculateTotals();  
  resetNewSportForm();
 
  const success = await updateDatabase();
  if (success) {
    alert('Sport added and database updated successfully.');
  }
};
 
const increaseMedal = async (sportName: string, medalType: string) => {
  const sport = props.event.medals_by_sport?.until_2024?.sports.find(s => s.name === sportName);
  if (sport) {
    sport[medalType] += 1;
    calculateTotals();  
    const success = await updateDatabase();
    if (success) {
      alert(`Increased ${medalType} medal for ${sportName} and database updated successfully.`);
    }
  }
};
 
const decreaseMedal = async (sportName: string, medalType: string) => {
  const sport = props.event.medals_by_sport?.until_2024?.sports.find(s => s.name === sportName);
  if (sport && sport[medalType] > 0) {
    sport[medalType] -= 1;
    calculateTotals(); 
    const success = await updateDatabase();
    if (success) {
      alert(`Decreased ${medalType} medal for ${sportName} and database updated successfully.`);
    }
  }
};
 
const resetNewSportForm = () => {
  newSportName.value = '';
  newSportGold.value = 0;
  newSportSilver.value = 0;
  newSportBronze.value = 0;
  showAddSportForm.value = false;
};
 
const getAuthToken = () => {
  if (!authStore.token) {
    console.error('No authentication token found in store.');
  }
  return authStore.token;
};
 
const updateDatabase = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      return false;
    }
 
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/update-sports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(props.event),
    });
 
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Failed to update database:', response.status, errorData);
      return false;
    }
 
    const result = await response.json();
    console.log('Database updated successfully:', result);
 
    await fetchLatestEventData();
    return true;
  } catch (error) {
    console.error('Error updating database:', error);
    return false;
  }
};
 
async function fetchLatestEventData() {
  await eventStore.fetchAllEvents();
}

watch(() => props.event.medals_by_sport?.until_2024?.sports, calculateTotals, { deep: true });
</script>
 
<template>
  <div class="p-4 relative">
  <h2 class="text-2xl font-bold mb-4 text-center md:text-left">Medal Details for {{ event.name }}</h2>
   
      <div class="flex flex-col md:flex-row justify-between mb-4">
  <button v-if="isAdmin" @click="toggleAddSportForm" class="bg-customRed text-white px-4 py-2 rounded hover:bg-customOrange mb-2 md:mb-0 md:mr-2">
          Add Sport
  </button>
  <button v-if="isAdmin" @click="toggleUpdateButtons" class="bg-customRed text-white px-4 py-2 rounded hover:bg-customOrange">
          Update Medals
  </button>
  </div>
   
      <div v-if="showAddSportForm" class="mt-4 bg-gray-100 p-4 rounded">
  <h3 class="text-lg font-semibold text-center">Add New Sport</h3>
  <input v-model="newSportName" type="text" placeholder="Sport Name" class="border p-2 mb-2 w-full" />
  <input v-model="newSportGold" type="number" placeholder="Gold" class="border p-2 mb-2 w-full" />
  <input v-model="newSportSilver" type="number" placeholder="Silver" class="border p-2 mb-2 w-full" />
  <input v-model="newSportBronze" type="number" placeholder="Bronze" class="border p-2 mb-2 w-full" />
  <button @click="addSport" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full">Add</button>
  </div>
   
      <div class="mb-4 overflow-x-auto">
  <table class="w-full border-collapse text-sm md:text-base">
  <thead>
  <tr class="bg-gray-200">
  <th class="p-2 border border-gray-300 text-center">Sport</th>
  <th class="p-2 border border-gray-300 text-center">Gold</th>
  <th class="p-2 border border-gray-300 text-center">Silver</th>
  <th class="p-2 border border-gray-300 text-center">Bronze</th>
  </tr>
  </thead>
  <tbody>
  <tr v-for="sport in event.medals_by_sport?.until_2024?.sports || []" :key="sport.name" class="text-center">
  <td class="p-2 border border-gray-300">{{ sport.name }}</td>
  <td class="p-2 border border-gray-300">
                {{ sport.gold }}
  <div v-if="showUpdateButtons && isAdmin" class="flex justify-center space-x-2">
  <button @click="increaseMedal(sport.name, 'gold')" class="text-green-500">+</button>
  <button @click="decreaseMedal(sport.name, 'gold')" class="text-red-500">-</button>
  </div>
  </td>
  <td class="p-2 border border-gray-300">
                {{ sport.silver }}
  <div v-if="showUpdateButtons && isAdmin" class="flex justify-center space-x-2">
  <button @click="increaseMedal(sport.name, 'silver')" class="text-green-500">+</button>
  <button @click="decreaseMedal(sport.name, 'silver')" class="text-red-500">-</button>
  </div>
  </td>
  <td class="p-2 border border-gray-300">
                {{ sport.bronze }}
  <div v-if="showUpdateButtons && isAdmin" class="flex justify-center space-x-2">
  <button @click="increaseMedal(sport.name, 'bronze')" class="text-green-500">+</button>
  <button @click="decreaseMedal(sport.name, 'bronze')" class="text-red-500">-</button>
  </div>
  </td>
  </tr>
  <tr class="font-semibold bg-gray-100">
  <td class="p-2 border border-gray-300 text-center">Total</td>
  <td class="p-2 border border-gray-300 text-center">{{ event.gold_medals || 0 }}</td>
  <td class="p-2 border border-gray-300 text-center">{{ event.silver_medals || 0 }}</td>
  <td class="p-2 border border-gray-300 text-center">{{ event.bronze_medals || 0 }}</td>
  </tr>
  </tbody>
  </table>
  </div>
  </div>
  </template>
   
  <style scoped>
  @media (max-width: 768px) {
    .p-4 {
      padding: 1rem;
    }
    .text-2xl {
      font-size: 1.5rem;
    }
    table {
      font-size: 0.875rem;
    }
    button {
      padding: 0.5rem;
    }
  }
  </style>
  
  has context menu