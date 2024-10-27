<template>
  <div class="comment-section max-w-lg mx-auto mt-8 p-6">
    <h3 class="text-lg font-bold mb-4">Leave a Cheer up message</h3>
    <input
      v-model="commenterName"
      placeholder="Your name"
      class="w-full mb-4 p-2 border border-gray-300 rounded-lg"
    />
    <textarea
      v-model="commentText"
      placeholder="Your Cheer up message"
      class="w-full mb-4 p-2 border border-gray-300 rounded-lg"
    ></textarea>
    <button
      @click="submitComment"
      class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
    >
      Submit
    </button>

    <ul class="mt-6">
      <li v-for="(comment, index) in comments" :key="index" class="mb-4">
        <strong>{{ comment.name }}</strong>
        <span class="text-gray-600">({{ comment.date }})</span>:
        {{ comment.text }} from {{ country.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/comment'
import { useMessageStore } from '@/stores/message'
import EventService from '@/services/Service'
import type { Country, Event } from '@/type'

const route = useRoute()
const router = useRouter()
const commentStore = useCommentStore()
const messageStore = useMessageStore()
const country = ref<Country | null>(null)
const events = ref<Event[]>([])
const eventStore = useEventStore()

const commenterName = ref('')
const commentText = ref('')
const comments = ref<{ name: string; text: string; date: string }[]>([])

async function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.')
    return
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString(),
  }

  commentStore.addComment(newComment)
  messageStore.updateMessage('Comment successfully posted!')

  commenterName.value = ''
  commentText.value = ''

  router.push({ name: 'list-view', query: { pageSize: 5, page: 1 } })
}
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

// Optionally, load existing comments if needed.
comments.value = commentStore.comments
</script>

<style scoped>
.comment-section {
  background-color: white;
  border-radius: 8px;
}
</style>
