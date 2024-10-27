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
 
    const response = await fetch('http://localhost:8080/api/v1/update-sports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(props.event),
    });
 
    if (!response.ok) {
      const errorData = await response.text(); // Read as text for non-JSON error responses
      console.error('Failed to update database:', response.status, errorData);
      alert(`Failed to update database: ${response.status} - ${errorData}`);
      return false;
    }
 
    // Attempt to parse response as JSON; if not JSON, fallback to text
    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }
 
    console.log('Database updated successfully:', result);
    return true;
  } catch (error) {
    console.error('Error updating database:', error);
    alert('Error updating database: ' + error.message);
    return false;
  }
};
 
const calculateTotals = () => {
  const sports = props.event.medals_by_sport?.until_2024?.sports || [];
  const totalGold = sports.reduce((total, sport) => total + sport.gold, 0);
  const totalSilver = sports.reduce((total, sport) => total + sport.silver, 0);
  const totalBronze = sports.reduce((total, sport) => total + sport.bronze, 0);
 
  props.event.medals_by_sport.until_2024.total = {
    gold: totalGold,
    silver: totalSilver,
    bronze: totalBronze,
  };
};
 
watch(() => props.event.medals_by_sport?.until_2024?.sports, calculateTotals, { deep: true });
</script>
 
<template>
  <div class="p-4 relative">
    <h2 class="text-2xl font-bold mb-4">Medal Details for {{ event.name }}</h2>
 
    <button  v-if="isAdmin" @click="toggleAddSportForm" class="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
      Add Sport
    </button>
 
    <button  v-if="isAdmin"  @click="toggleUpdateButtons" class="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
      Update Medals
    </button>
 
    <div v-if="showAddSportForm" class="mt-4 bg-gray-100 p-4 rounded">
      <h3 class="text-lg font-semibold">Add New Sport</h3>
      <input v-model="newSportName" type="text" placeholder="Sport Name" class="border p-2 mr-2" />
      <input v-model="newSportGold" type="number" placeholder="Gold" class="border p-2 mr-2" />
      <input v-model="newSportSilver" type="number" placeholder="Silver" class="border p-2 mr-2" />
      <input v-model="newSportBronze" type="number" placeholder="Bronze" class="border p-2 mr-2" />
      <button @click="addSport" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Add</button>
    </div>
 
    <!-- Table for medal data display -->
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
          <tr v-for="sport in event.medals_by_sport?.until_2024?.sports || []" :key="sport.name">
            <td class="p-2 border border-gray-300 text-center font-semibold">{{ sport.name }}</td>
            <td class="p-2 border border-gray-300 text-center" data-label="Gold">
              {{ sport.gold }}
              <div v-if="showUpdateButtons  && isAdmin" class="flex justify-center items-center space-x-2">
                <button @click="increaseMedal(sport.name, 'gold')" class="text-green-500 hover:text-green-700">+</button>
                <button @click="decreaseMedal(sport.name, 'gold')" class="text-red-500 hover:text-red-700">-</button>
              </div>
            </td>
            <td class="p-2 border border-gray-300 text-center" data-label="Silver">
              {{ sport.silver }}
              <div v-if="showUpdateButtons  && isAdmin" class="flex justify-center items-center space-x-2">
                <button @click="increaseMedal(sport.name, 'silver')" class="text-green-500 hover:text-green-700">+</button>
                <button @click="decreaseMedal(sport.name, 'silver')" class="text-red-500 hover:text-red-700">-</button>
              </div>
            </td>
            <td class="p-2 border border-gray-300 text-center" data-label="Bronze">
              {{ sport.bronze }}
              <div v-if="showUpdateButtons  && isAdmin" class="flex justify-center items-center space-x-2">
                <button @click="increaseMedal(sport.name, 'bronze')" class="text-green-500 hover:text-green-700">+</button>
                <button @click="decreaseMedal(sport.name, 'bronze')" class="text-red-500 hover:text-red-700">-</button>
              </div>
            </td>
          </tr>
          <tr class="font-semibold bg-gray-100">
            <td class="p-2 border border-gray-300 text-center">Total</td>
            <td class="p-2 border border-gray-300 text-center" data-label="Total Gold">
              {{ event.medals_by_sport?.until_2024?.total?.gold || 0 }}
            </td>
            <td class="p-2 border border-gray-300 text-center" data-label="Total Silver">
              {{ event.medals_by_sport?.until_2024?.total?.silver || 0 }}
            </td>
            <td class="p-2 border border-gray-300 text-center" data-label="Total Bronze">
              {{ event.medals_by_sport?.until_2024?.total?.bronze || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>