<template>
  <div
    class="comment-section max-w-lg mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-sm"
  >
    <h3 class="text-lg font-bold mb-4">Leave a Comment</h3>
    <input
      v-model="commenterName"
      placeholder="Your name"
      class="w-full mb-4 p-2 border border-gray-300 rounded-lg"
    />
    <textarea
      v-model="commentText"
      placeholder="Your comment"
      class="w-full mb-4 p-2 border border-gray-300 rounded-lg"
    ></textarea>
    <button
      @click="submitComment"
      class="px-4 py-2 bg-customRed text-white rounded hover:bg-customOrange"
    >
      Submit comment
    </button>

    <ul class="mt-6">
      <li v-for="(comment, index) in comments" :key="index" class="mb-4">
        <strong>{{ comment.name }}</strong>
        <span class="text-gray-600">({{ comment.date }})</span>:
        <p>{{ comment.text }}</p>
        <p class="text-gray-500 text-sm">Commented on {{ comment.country }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommentStore } from '@/stores/comment'
import { useMessageStore } from '@/stores/message'

const route = useRoute()
const router = useRouter()
const commentStore = useCommentStore()
const messageStore = useMessageStore()

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
    country: 'Unknown'
  }

  commentStore.addComment(newComment)
  messageStore.updateMessage('Comment successfully posted!')

  commenterName.value = ''
  commentText.value = ''

  router.push({ name: 'list-view', query: { pageSize: 5, page: 1 } })
}

// Optionally, load existing comments if needed.
comments.value = commentStore.comments
</script>

<style scoped>
.comment-section {
  background-color: white;
  border-radius: 8px;
}
</style>
