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
        {{ comment.text }} from <strong>{{ countryName }}</strong>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/comment'
import { useMessageStore } from '@/stores/message'
import { useEventStore } from '@/stores/event'


const route = useRoute()
const router = useRouter()
const commentStore = useCommentStore()
const messageStore = useMessageStore()
const eventStore = useEventStore()
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
  { name: string; text: string; date: string; country: string }[]
>([])


// Load existing comments
comments.value = commentStore.comments

// Submit comment
async function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.')
    return
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString(),
    country: countryName
  }

  commentStore.addComment(newComment)
  messageStore.updateMessage('Comment successfully posted!')

  // Reset fields
  commenterName.value = ''
  commentText.value = ''

  // Refresh the comments list
  comments.value = [...commentStore.comments]
}

</script>

<style scoped>
.comment-section {
  background-color: white;
  border-radius: 8px;
}
</style>
