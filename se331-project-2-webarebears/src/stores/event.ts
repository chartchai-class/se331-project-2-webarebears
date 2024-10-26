import { defineStore } from 'pinia';
import { ref } from 'vue';
import EventService from '@/services/Service';
import type { Event } from '@/type';
 
export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([]);
  const currentEvent = ref<Event | null>(null);
  const paginatedEvents = ref<Event[]>([]);
  const searchResults = ref<Event[]>([]);  // Initialized as an empty array
 
  function setEvents(newEvents: Event[]) {
    events.value = newEvents;
  }
 
  function setEvent(event: Event) {
    currentEvent.value = event;
  }
 
  function getEventById(id: string): Event | undefined {
    return events.value.find((event) => event.id === id);
  }
 
  async function fetchAllEvents() {
    try {
      const response = await EventService.getAllEvents();
      if (Array.isArray(response)) {
        events.value = response;
      } else {
        console.error('Expected an array but got:', response);
        events.value = [];
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      events.value = [];
    }
  }
 
  function setSearchResults(newResults: Event[]) {
    searchResults.value = newResults;
  }
 
  async function searchByKeyword(keyword: string, pageSize: number, page: number) {
    try {
      const response = await EventService.searchByKeyword(keyword, pageSize, page);
      if (response && Array.isArray(response.content)) {
        setSearchResults(response.content);  // Use only the "content" array
      } else {
        console.error('Unexpected API response format:', response);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Failed to search events:', error);
      setSearchResults([]);
    }
  }
 
  return {
    events,
    currentEvent,
    paginatedEvents,
    setEvents,
    setEvent,
    getEventById,
    fetchAllEvents,
    searchByKeyword,
    searchResults,
    setSearchResults,
  };
});