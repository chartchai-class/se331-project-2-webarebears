<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import { useEventStore } from '@/stores/event'
import { useCommentStore } from '@/stores/comment'
import CountryContent from '@/components/CountryContent.vue'
import Counter from '@/components/Counter.vue'
import backgroundImage from '@/assets/la.jpg'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()
const messageStore = useMessageStore()
const commentStore = useCommentStore()

const pageSize = ref(Number(route.query.pageSize) || 5)
const page = ref(Number(route.query.page) || 1)
const totalEvents = ref(0)

const commenterName = ref('')
const commentText = ref('')
const comments = ref<{ name: string; text: string; date: string }[]>([])

const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value))
const hasNextPage = computed(() => page.value < totalPages.value)
const hasPrevPage = computed(() => page.value > 1)

const keyword = ref('')

onMounted(async () => {
  if (!route.query.pageSize || !route.query.page) {
    router.replace({
      name: 'list-view',
      query: { pageSize: pageSize.value, page: page.value },
    })
  }
  await eventStore.fetchAllEvents()
  totalEvents.value = eventStore.events.length
})

watch([pageSize, page], () => {
  router.push({
    name: 'list-view',
    query: { pageSize: pageSize.value, page: page.value },
  })
})

function updatePageSize(size: number) {
  pageSize.value = size
  page.value = 1
}

function changePage(newPage: number) {
  page.value = newPage
}

function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.')
    return
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString(),
  }

  comments.value.push(newComment)
  messageStore.updateMessage('Comment successfully posted!')

  commenterName.value = ''
  commentText.value = ''
}
</script>

<template>
  <Counter
    :year="2028"
    :month="7"
    :date="14"
    :hour="0"
    :minute="0"
    :second="0"
    :millisecond="0"
  />

  <div class="bg-customBlue py-10">
    <div class="w-64">
      <baseInput v-model="keyword" label="Search ..." class="w-full" />
    </div>
    <h1 class="text-3xl font-bold text-center mb-6 mt-10 pt-10 text-white">
      Olympic Medal Table
    </h1>

    <div class="w-4/5 mx-auto">
      <div class="block md:hidden">
        <select
          id="page-size"
          v-model="pageSize"
          @change="updatePageSize(pageSize)"
          class="border rounded px-4 py-1 mb-4"
        >
          <option v-for="n in [5, 10, 15, 20, 25, 30]" :key="n" :value="n">
            Show {{ n }} Events
          </option>
        </select>
      </div>
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
                <option
                  v-for="n in [5, 10, 15, 20, 25, 30]"
                  :key="n"
                  :value="n"
                >
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

        <CountryContent :page="page" :pageSize="pageSize" />
      </table>
    </div>
  </div>

  <div class="bg-white py-10">
    <div
      class="flex flex-col md:flex-row justify-center mt-6 space-x-6 w-4/5 mx-auto"
    >
      <!-- Comment Input Area -->
      <div class="w-full md:w-1/2 mb-6 md:mb-0 flex justify-center">
        <div
          class="comment-box max-w-xl w-full p-6 border border-gray-300 rounded-lg"
        >
          <h3 class="text-lg font-semibold mb-4">Leave a Cheer up message</h3>
          <input
            v-model="commenterName"
            placeholder="Your name"
            class="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <textarea
            v-model="commentText"
            placeholder="Your Cheer up message"
            class="w-full p-2 mb-4 border border-gray-300 rounded"
          ></textarea>
          <button
            @click="submitComment"
            class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
          >
            Submit
          </button>
        </div>
      </div>

      <!-- Comment List -->
      <div class="w-full md:w-1/2 flex justify-center ">
        <div class="border border-gray-300 rounded-lg p-4 max-w-xl w-full">
          <h3 class="text-lg font-semibold mb-4">Messages</h3>
          <ul class="space-y-4">
            <li
              v-for="(comment, index) in comments"
              :key="index"
              class="bg-gray-100 p-4 rounded-lg"
            >
              <strong>{{ comment.name }}</strong> ({{ comment.date }}):
              {{ comment.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="totalPages > 1"
    class="flex justify-center items-center max-w-sm mx-auto mb-6 space-x-20"
  >
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
</template>
<style scoped>
.comment-box {
  background-color: white;
  border-radius: 8px;
  width: 100%; /* Full width within the flex container */
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
    display: flex;
    justify-content: space-between;
  }

  td::before {
    content: attr(data-label); /* Labels for each item */
    font-weight: bold;
    color: #4a5568;
  }
}
</style>
