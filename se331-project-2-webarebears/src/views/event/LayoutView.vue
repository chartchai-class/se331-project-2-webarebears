<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { useEventStore } from '@/stores/event'
import { useMessageStore } from '@/stores/message'
import { useCommentStore } from '@/stores/comment'
import Sidebar from '@/components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const countryId = route.params.id as string
const eventStore = useEventStore()
const messageStore = useMessageStore()
const commentStore = useCommentStore()

const event = computed(
  () => eventStore.currentEvent || eventStore.getEventById(countryId),
)

</script>
<template>
  <div class="dashboard mt-20">
    <Sidebar :countryId="countryId" />

    <div class="content p-4">
      <div v-if="event">
        <h1 class="text-3xl font-bold mb-4">{{ event.name }}</h1>

        <RouterView v-if="event" :key="event.id" :event="event" />
      </div>
      <div v-else>
        <p>Country not found or failed to load.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr 5fr;
  background-color: teal;
  height: 100vh;
  width: 100vw;
}
.content {
  background-color: white;
  border-radius: 10px;
  margin: 6px 6px 6px 0px;
}
</style>
