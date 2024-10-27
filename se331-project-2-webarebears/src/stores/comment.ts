import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as {
      name: string
      text: string
      date: string
      country: string
    }[],
  }),
  actions: {
    addComment(comment: {
      name: string
      text: string
      date: string
      country: string
    }) {
      this.comments.push(comment)
    },
    getComments() {
      return this.comments
    },
  },
})
