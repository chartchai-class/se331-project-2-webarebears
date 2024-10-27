<template>
  <div class="comment-section max-w-lg mx-auto mt-8 p-6">
    <h3 class="text-lg font-bold mb-4">Leave a Cheer up message</h3>

    <!-- Check if the user is logged in before displaying the comment form -->
    <div v-if="isLoggedIn">
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
    </div>

    <!-- Message to prompt users to log in -->
    <div v-else class="text-gray-600 mb-4">
      Please
      <RouterLink to="/login" class="text-customRed">log in</RouterLink> to
      leave a comment.
    </div>

    <ul class="mt-6">
      <li
        v-for="(comment, index) in filteredComments"
        :key="index"
        class="mb-4"
      >
        <strong>{{ comment.name }}</strong>
        <span class="text-gray-600">({{ comment.date }})</span>:
        {{ comment.text }} from
        <strong>{{ getCountryName(comment.countryId) }}</strong>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/comment'
import { useMessageStore } from '@/stores/message'
import { useEventStore } from '@/stores/event'
import { useAuthStore } from '@/stores/auth' // Import your authentication store

const route = useRoute()
const router = useRouter()
const commentStore = useCommentStore()
const messageStore = useMessageStore()
const eventStore = useEventStore()
const authStore = useAuthStore() // Initialize the auth store
const countryId = route.params.id as string

// Define the event
const event = computed(() => {
  return eventStore.currentEvent || eventStore.getEventById(countryId)
})

// Use optional chaining to safely access event.name
const countryName = event.value?.name || 'Unknown Country'

const commenterName = ref('')
const commentText = ref('')
const comments = ref<
  { name: string; text: string; date: string; countryId: string }[]
>([])

// Load existing comments filtered by the current country ID
const filteredComments = computed(() =>
  commentStore.getCommentsByCountryId(countryId),
)

// Load existing comments for this country
comments.value = commentStore.getCommentsByCountryId(countryId)

// Load existing comments
comments.value = commentStore.comments

// Computed property to check if the user is logged in
const isLoggedIn = computed(() => authStore.isLoggedIn)

async function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.')
    return
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString(),
    countryId: countryId,
  }

  commentStore.addComment(newComment)
  messageStore.updateMessage('Comment successfully posted!')

  // Reset fields
  commenterName.value = ''
  commentText.value = ''

  filteredComments.value = commentStore.getCommentsByCountryId(countryId)

  router.push({ name: 'list-view', query: { pageSize: 5, page: 1 } })
}

// Function to get the country name based on the country ID
function getCountryName(countryId: string) {
  const event = eventStore.getEventById(countryId) // Fetch event based on countryId
  return event?.name || 'Unknown Country' // Return country name or default
}
</script>

<style scoped>
.comment-section {
  background-color: white;
  border-radius: 8px;
}
</style>
