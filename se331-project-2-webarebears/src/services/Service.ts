import axios from 'axios'
import type { Country } from '@/type';
 
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
 
export default {
    async getAllEvents(): Promise<Event[]> {
        const response = await apiClient.get<Event[]>('api/events');
        return response.data;
    },
 
    async getEvent(id: string): Promise<Event> {
        const response = await apiClient.get<Event>(`api/events/${id}`);
        return response.data;
    },
  
    async getCountry(id: string): Promise<Country> {
        const response = await apiClient.get<Country>(`api/countries/${id}`);
        return response.data;
    },
 
    async searchByKeyword(keyword: string, pageSize: number, page: number) {
      const response = await apiClient.get(`/api/events/search/${keyword}`, {
        params: { page, size: pageSize },
      });
      return response.data;  
    }
  };

