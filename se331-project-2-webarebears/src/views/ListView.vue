<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMessageStore } from '@/stores/message';
import { useEventStore } from '@/stores/event';
import { useCommentStore } from '@/stores/comment';
import { useAuthStore } from '@/stores/auth';
import CountryContent from '@/components/CountryContent.vue';
import Counter from '@/components/Counter.vue';
import apiClient from '@/services/AxiosClient';

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();
const messageStore = useMessageStore();
const commentStore = useCommentStore();
const authStore = useAuthStore();

const pageSize = ref(Number(route.query.pageSize) || 5);
const page = ref(Number(route.query.page) || 1);
const totalEvents = ref(0);
const keyword = ref('');

const showForm = ref(false);
const editMode = ref(false);
const currentCountryId = ref<string | null>(null);
const countryId = route.params.id as string

const newCountry = ref({
  id: '',
  name: '',
  description: '',
  hostcountry: '',
  flag_url: '',
  events: [
    {
      id: '',
      name: '',
      flag_url: '',
      total_medals: 0,
      gold_medals: 0,
      silver_medals: 0,
      bronze_medals: 0,
      sports: [{ name: '', gold: 0, silver: 0, bronze: 0 }]
    },
  ],
});

const countryName = computed(() => newCountry.value.name || 'Unknown Country');

const commenterName = ref('')
const commentText = ref('')
const comments = ref<
  { name: string; text: string; date: string; countryId: string }[]
>([])
comments.value = commentStore.getCommentsByCountryId(countryId)
 
comments.value = commentStore.comments
 
const isLoggedIn = computed(() => authStore.isLoggedIn)

watch(
  () => [newCountry.value.id, newCountry.value.name, newCountry.value.flag_url],
  () => {
    newCountry.value.events.forEach(event => {
      event.id = newCountry.value.id;
      event.name = newCountry.value.name;
      event.flag_url = newCountry.value.flag_url;
    });
  },
  { deep: true }
);

function updatePageSize(newSize: number) {
  pageSize.value = newSize;
  page.value = 1;

  router.replace({ name: 'list-view', query: { pageSize: newSize, page: page.value } });
}

const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value));
const hasNextPage = computed(() => page.value < totalPages.value);
const hasPrevPage = computed(() => page.value > 1);

function toggleAddCountryForm() {
  showForm.value = !showForm.value;
  editMode.value = false;
  resetCountryForm();
}

function resetCountryForm() {
  newCountry.value = {
    id: '',
    name: '',
    description: '',
    hostcountry: '',
    flag_url: '',
    events: [
      {
        id: '',
        name: '',
        flag_url: '',
        total_medals: 0,
        gold_medals: 0,
        silver_medals: 0,
        bronze_medals: 0,
        sports: [{ name: '', gold: 0, silver: 0, bronze: 0 }]
      },
    ],
  };
}
async function submitCountry() {
  if (editMode.value) {
    await editCountry();
  } else {
    await addCountry();
  }
}

async function addCountry() {
  try {
    await apiClient.post('/api/countries/add-with-events', newCountry.value);
    messageStore.updateMessage('Country added successfully!');
    showForm.value = false;
    resetCountryForm();
    await eventStore.fetchAllEvents(); 
    totalEvents.value = eventStore.events.length;
  } catch (error) {
    console.error('Failed to add country:', error);
    messageStore.updateMessage('Failed to add country.');
  }
}

async function editCountry() {
  try {
    if (currentCountryId.value) {
      await apiClient.put(`/api/countries/${currentCountryId.value}`, newCountry.value);
      messageStore.updateMessage('Country updated successfully!');
      showForm.value = false;
      resetCountryForm();
      await eventStore.fetchAllEvents(); 
      totalEvents.value = eventStore.events.length;
    }
  } catch (error) {
    console.error('Failed to update country:', error);
    messageStore.updateMessage('Failed to update country.');
  }
}


function changePage(newPage: number) {
  page.value = newPage;
}

async function updateKeyword() {
  try {
    if (!keyword.value.trim()) {
      eventStore.setSearchResults(eventStore.events);
      totalEvents.value = eventStore.events.length;
    } else {
      await eventStore.searchByKeyword(keyword.value, pageSize.value, page.value);
      totalEvents.value = eventStore.searchResults.length;
    }
  } catch (error) {
    console.error('Failed to update keyword:', error);
  }
}

watch(
  () => newCountry.value.events,
  (events) => {
    events.forEach(event => {
      let goldTotal = 0;
      let silverTotal = 0;
      let bronzeTotal = 0;
      event.sports.forEach(sport => {
        goldTotal += sport.gold;
        silverTotal += sport.silver;
        bronzeTotal += sport.bronze;
      });
      event.gold_medals = goldTotal;
      event.silver_medals = silverTotal;
      event.bronze_medals = bronzeTotal;
      event.total_medals = goldTotal + silverTotal + bronzeTotal;
    });
  },
  { deep: true }
);

function addSport(eventIndex: number) {
  newCountry.value.events[eventIndex].sports.push({ name: '', gold: 0, silver: 0, bronze: 0 });
}

function removeSport(eventIndex: number, sportIndex: number) {
  newCountry.value.events[eventIndex].sports.splice(sportIndex, 1);
}

// Comment Functionality
function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.');
    return;
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString(),
    countryId: countryId
  };

  comments.value.push(newComment);
  messageStore.updateMessage('Comment successfully posted!');
  commenterName.value = '';
  commentText.value = '';
  comments.value = commentStore.comments
  comments.value = commentStore.getCommentsByCountryId(countryId)

}
function getCountryName(countryId: string) {
  const event = eventStore.getEventById(countryId) 
  return event?.name || 'Unknown Country' 
}

onMounted(async () => {
  if (!route.query.pageSize || !route.query.page) {
    router.replace({ name: 'list-view', query: { pageSize: pageSize.value, page: page.value } });
  }else {
    pageSize.value = Number(route.query.pageSize); 
  }
  await eventStore.fetchAllEvents();
  totalEvents.value = eventStore.events.length;
});

</script>

<template>
  <Counter :year="2028" :month="7" :date="14" :hour="0" :minute="0" :second="0" :millisecond="0" />
  
  <div class="bg-customBlue py-10">
    <div class="w-64 mr-20 mx-auto">
      <input
        id="search"
        type="text"
        v-model="keyword"
        @input="updateKeyword"
        class="border rounded px-2 py-1 w-full"
        placeholder="Enter country name"
      />
    </div>
    <h1 class="text-3xl font-bold text-center mb-6 mt-5 pt-5 text-white">Olympic Medal Table</h1>
    
    <button 
  v-if="authStore.isAdmin" 
  @click="toggleAddCountryForm" 
  class="px-6 py-2 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mb-6 mt-6 mx-auto block text-lg"
  style="background-color: #e74c3c;"
>
  {{ showForm ? "Cancel" : "Add New Country" }}
</button>


    <div class="w-4/5 mx-auto">
      <table class="min-w-full table-auto border-collapse mb-6">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border text-center">Flag</th>
            <th class="px-4 py-2 border text-center">
              Country
              <select
                id="page-size"
                v-model="pageSize"
                @change="updatePageSize(pageSize)"
                class="border rounded px-2 py-1"
              >
                <option v-for="n in [5, 10, 15, 20, 25, 30]" :key="n" :value="n">
                  {{ n }}
                </option>
              </select>
            </th>
            <th class="px-4 py-2 border text-center">Gold</th>
            <th class="px-4 py-2 border text-center">Silver</th>
            <th class="px-4 py-2 border text-center">Bronze</th>
            <th class="px-4 py-2 border text-center">Total Medals</th>
          </tr>
        </thead>
        <CountryContent :events="keyword ? eventStore.searchResults : eventStore.events" :page="page" :pageSize="pageSize" />
      </table>
    </div>
  </div>

  
  <div class="bg-white py-10">
    <div
      v-if="isLoggedIn"
      class="flex flex-col md:flex-row justify-center mt-6 w-4/5 mx-auto space-y-6 md:space-y-0 md:space-x-6"
    >
    <div class="flex flex-col md:flex-row justify-center mt-6 w-4/5 mx-auto space-y-6 md:space-y-0 md:space-x-6">
      <div class="w-full md:w-1/2 flex justify-center">
        <div class="comment-box w-full p-6 border border-gray-300 rounded-lg">
          <h3 class="text-lg font-semibold mb-4">Leave a Cheer up message</h3>
          <input v-model="commenterName" placeholder="Your name" class="w-full p-2 mb-4 border border-gray-300 rounded" />
          <textarea v-model="commentText" placeholder="Your Cheer up message" class="w-full p-2 mb-4 border border-gray-300 rounded"></textarea>
          <button @click="submitComment" class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange">Submit</button>
        </div>
      </div>
      <div class="w-full md:w-1/2 flex justify-center">
        <div class="comment-list-container border border-gray-300 rounded-lg p-4 w-full">
          <h3 class="text-lg font-semibold mb-4">Messages</h3>
          <ul class="space-y-4">
            <li v-for="(comment, index) in comments" :key="index" class="bg-gray-100 p-4 rounded-lg">
              <strong>{{ comment.name }}</strong>
              <span class="text-gray-600">({{ comment.date }})</span>: {{ comment.text }} from <strong>{{ getCountryName(comment.countryId)}}</strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div> 
  <div v-else class="text-gray-600 mb-4">
      Please
      <RouterLink to="/login" class="text-customRed">log in</RouterLink> to
      leave a comment.
    </div>
  </div>
  


  <div v-if="totalPages > 1" class="flex justify-center items-center max-w-sm mx-auto mb-6 space-x-20">
    <RouterLink 
      v-if="hasPrevPage" 
      :to="{ name: 'list-view', query: { page: page - 1, pageSize: pageSize } }" 
      @click.prevent="changePage(page - 1)" 
      class="text-600 hover:underline"
    >
      &#60; Previous
    </RouterLink>
    <span class="font-semibold">Page {{ page }} of {{ totalPages }}</span>
    <RouterLink 
      v-if="hasNextPage" 
      :to="{ name: 'list-view', query: { page: page + 1, pageSize: pageSize } }" 
      @click.prevent="changePage(page + 1)" 
      class="text-600 hover:underline"
    >
      Next &#62;
    </RouterLink>
  </div>

  <div v-if="totalEvents === 0" class="text-center text-gray-500">
    <p>No countries available.</p>
  </div>
  <div v-if="showForm" class="add-country-form mt-10">
      <form @submit.prevent="submitCountry" class="space-y-4 p-6 border rounded-lg shadow-lg max-w-lg mx-auto bg-white">
        <h2 class="text-xl font-semibold mb-4">{{ editMode ? "Edit Country" : "Add New Country" }}</h2>

        <!-- Country Fields -->
        <div class="flex flex-col space-y-4">
          <div>
            <label for="id">Country ID:</label>
            <input v-model="newCountry.id" id="id" required class="w-full p-2 border rounded" placeholder="e.g., USA" />
          </div>
          <div>
            <label for="name">Country Name:</label>
            <input v-model="newCountry.name" id="name" required class="w-full p-2 border rounded" />
          </div>
          <div>
            <label for="flag_url">Flag URL:</label>
            <input v-model="newCountry.flag_url" id="flag_url" required class="w-full p-2 border rounded" />
          </div>
        </div>

        <!-- Events Section -->
        <label for="description" class="mt-4 block">Description:</label>
        <textarea v-model="newCountry.description" id="description" required class="w-full p-2 border rounded"></textarea>

        <label for="hostcountry" class="mt-4 block">Host Country:</label>
        <input v-model="newCountry.hostcountry" id="hostcountry" required class="w-full p-2 border rounded" />



<div v-for="(event, eventIndex) in newCountry.events" :key="eventIndex" class="p-3 border-b border-gray-200">
 
  <!-- Gold, Silver, Bronze Medal Inputs (Hidden) -->
  <div v-if="false" class="flex space-x-2 mt-4">
    <div class="flex-1">
      <label :for="'gold_medals_' + eventIndex">Gold:</label>
      <input type="number" v-model.number="event.gold_medals" :id="'gold_medals_' + eventIndex" min="0" class="w-full p-2 border rounded" />
    </div>
    <div class="flex-1">
      <label :for="'silver_medals_' + eventIndex">Silver:</label>
      <input type="number" v-model.number="event.silver_medals" :id="'silver_medals_' + eventIndex" min="0" class="w-full p-2 border rounded" />
    </div>
    <div class="flex-1">
      <label :for="'bronze_medals_' + eventIndex">Bronze:</label>
      <input type="number" v-model.number="event.bronze_medals" :id="'bronze_medals_' + eventIndex" min="0" class="w-full p-2 border rounded" />
    </div>
  </div>

  <!-- Sports for Each Event -->
  <h4 class="font-medium mt-4">Sports that got medals</h4>
  <div v-for="(sport, sportIndex) in event.sports" :key="sportIndex" class="p-3 border-b border-gray-200">
    <label :for="'sport_name_' + sportIndex">Sport Name:</label>
    <input v-model="sport.name" :id="'sport_name_' + sportIndex" required class="w-full p-2 border rounded mb-2" />
    <div class="flex space-x-2">
      <div class="flex-1">
        <label :for="'gold_' + sportIndex">Gold:</label>
        <input type="number" v-model.number="sport.gold" :id="'gold_' + sportIndex" min="0" class="w-full p-2 border rounded" />
      </div>
      <div class="flex-1">
        <label :for="'silver_' + sportIndex">Silver:</label>
        <input type="number" v-model.number="sport.silver" :id="'silver_' + sportIndex" min="0" class="w-full p-2 border rounded" />
      </div>
      <div class="flex-1">
        <label :for="'bronze_' + sportIndex">Bronze:</label>
        <input type="number" v-model.number="sport.bronze" :id="'bronze_' + sportIndex" min="0" class="w-full p-2 border rounded" />
      </div>
    </div>
    <div class="flex items-center space-x-2 mt-4">
    <span class="font-semibold">Total Medals:</span>
    <span>{{ event.total_medals }}</span>
  </div>
    <button type="button" @click="removeSport(eventIndex, sportIndex)" class="text-red-500 mt-2">Remove Sport</button>
  </div>
  <button type="button" @click="addSport(eventIndex)" class="text-customDarkBlue">+ Add Sport</button>
</div>

        <!-- Submit Button -->
        <button type="submit" class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange mt-4 w-full font-semibold">{{ editMode ? "Update Country" : "Add Country" }}</button>
      </form>
    </div>

</template>

<style scoped>
.add-country-form {
  margin-top: 20px;
}

.add-country-form input,
.add-country-form textarea {
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  width: 100%;
  transition: border-color 0.3s;
}

.add-country-form input:focus,
.add-country-form textarea:focus {
  border-color: #4f46e5;
}

.add-country-form button {
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.add-country-form button:hover {
  transform: scale(1.02);
  background-color: #4338ca;
}
</style>


<style scoped>
.comment-box,
.comment-list-container {
  background-color: white;
  border-radius: 8px;
  width: 100%; 
}

@media (max-width: 430px) {
  h1 {
    font-size: 25px;
  }
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
    justify-content: space-between;
  }

  td::before {
    content: attr(data-label);
    font-weight: bold;
    color: #4a5568;
  }
  input[type='text'] {
    width: 150px; 
    font-size: 12px;
    margin-left: 150px;
  }
}
</style>
