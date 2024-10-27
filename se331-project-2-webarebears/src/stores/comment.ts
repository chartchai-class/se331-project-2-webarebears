import { defineStore } from 'pinia'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as {
      name: string
      text: string
      date: string
      countryId: string
    }[],
  }),
  actions: {
    addComment(comment: {
      name: string
      text: string
      date: string
      countryId: string
    }) {
      this.comments.push(comment)
    },
    getComments() {
      return this.comments
    },
    getCommentsByCountryId(countryId: string) {
      return this.comments.filter(comment => comment.countryId === countryId)
    },
    
  },
  getters: {
    // Getter to filter comments by countryId
    getCommentsByCountryId: state => {
      return (countryId: string) => {
        return state.comments.filter(comment => comment.countryId === countryId)
      }
    },
  },
})
