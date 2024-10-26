// import axios from 'axios';
// import type { Event, Country } from '@/type';
 
// const apiClient = axios.create({
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//   },
// });
 
// export default {
//   async getAllEvents(): Promise<Event[]> {
//     const parts = [
//       'countrymedal/data1',
//       'data2/data2',
//       'data3/data3',
//       'data4/data4',
//       'data5/data5',
//       'data6/data6',
//       'data7/data7',
//       'data8/data8',
//       'data9/data9',
//       'data10/data10',
//     ];
 
//     const dataPromises = parts.map((part) =>
//       apiClient
//         .get(`https://my-json-server.typicode.com/Jasmxnej/${part}`)
//         .then((response) => response.data as Event[])
//     );
//     const results = await Promise.all(dataPromises);
 
//     return results.flat();
//   },
 
//   async getEvent(id: string): Promise<Event> {
//     const events = await this.getAllEvents();
//     const event = events.find((event) => event.id === id);
//     if (!event) {
//       throw new Error(`Event with ID ${id} not found`);
//     }
//     return event;
//   },
 
//   async getCountryDetails(): Promise<Country[]> {
//     const parts = ['dbolympic', 'dbolympic2', 'dbolympic3', 'dbolympic4', 'dbolympic5','dbolympic6','dbolympic7','dbolympic8','dbolympic9'];
//     const dataPromises = parts.map((part) =>
//       apiClient
//         .get(`https://my-json-server.typicode.com/matchimaky/${part}/country`)
//         .then((response) => response.data as Country[])
//     );
//     const results = await Promise.all(dataPromises);
 
//     return results.flat();
//   },
 
//   async getCountry(id: string): Promise<Country> {
//     const countries = await this.getCountryDetails();
//     const country = countries.find((country) => country.id === id);
//     if (!country) {
//       throw new Error(`Country with ID ${id} not found`);
//     }
//     return country;
//   },
// };
 
 
// import apiClient from './AxiosClient'
// import type { AxiosResponse } from 'axios'
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

