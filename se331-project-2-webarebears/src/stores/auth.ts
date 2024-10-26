// import { defineStore } from 'pinia';
// import axios from 'axios';
// import type { User } from '@/type';

// const apiClient = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     withCredentials: false,
//     headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//     },
// });

// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         token: null as string | null,
//         user: null as User | null,
//     }),
//     getters: {
//         isAuthenticated(): boolean {
//             return this.user !== null;
//         },
//         currentUserName(): string {
//             return this.user?.firstname || '';
//         },
//         isAdmin(): boolean {
//             return this.user?.roles?.includes('ROLE_ADMIN') || false;
//         },
//     },
//     actions: {
//         checkAuthStatus() {
//             const token = localStorage.getItem('access_token');
//             const user = localStorage.getItem('user');
            
//             console.log("Stored token:", token);
//             console.log("Stored user data:", user);
        
//             if (token && user) {
//                 try {
//                     this.token = token;
//                     this.user = JSON.parse(user);
//                     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//                     console.log("User data restored from localStorage:", this.user);
//                 } catch (error) {
//                     console.error('Failed to parse user data:', error);
//                     localStorage.removeItem('access_token');
//                     localStorage.removeItem('user');
//                 }
//             }
//         }
//         ,
//         async login(username: string, password: string) {
//             try {
//                 const response = await apiClient.post('/api/v1/auth/authenticate', {
//                     username,
//                     password,
//                 });
//                 this.token = response.data.access_token;
//                 this.user = response.data.user;

//                 // Store token and user in localStorage
//                 localStorage.setItem('access_token', this.token as string);
//                 localStorage.setItem('user', JSON.stringify(this.user));
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
//             } catch (error) {
//                 console.error('Login error:', error.response ? error.response.data : error.message);
//                 throw error;
//             }
//         },
//         logout() {
//             this.token = null;
//             this.user = null;
//             localStorage.removeItem('access_token');
//             localStorage.removeItem('user');
//             delete axios.defaults.headers.common['Authorization'];
//         },

//         async fetchUserProfile() {
//             if (this.user?.id) {
//                 try {
//                     const response = await apiClient.get(`/api/users/${this.user.id}`, {
//                         headers: { Authorization: `Bearer ${this.token}` }
//                     });
//                     this.user = response.data;
//                 } catch (error) {
//                     console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
//                     throw error;
//                 }
//             }
//         },

//     register(email: string, password: string, name: string, lastname: string) {
//       return apiClient
//         .post('/api/v1/auth/register', {
//           email: email,
//           password: password,
//           firstname: name,
//           lastname: lastname,
//         })
//         .then((response) => {
//           console.log('Registration successful', response.data);
//           return response;
//         })
//         .catch((error) => {
//           console.error('Registration error', error);
//           throw error;
//         });
//     },
//     getAllUsers() {
//       return apiClient
//         .get('/api/users')
//         .then((response) => response.data)
//         .catch((error) => {
//           console.error('Error fetching users:', error.response ? error.response.data : error.message);
//           throw error;
//         });
//     },
//   },
  
// });

import { defineStore } from 'pinia';
import apiClient from '@/services/AxiosClient';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as User | null,
  }),
  getters: {
    isAuthenticated(): boolean {
      return this.user !== null;
    },
    isAdmin(): boolean {
      return this.user?.roles.includes('ROLE_ADMIN');
    },
  },
  actions: {
    checkAuthStatus() {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          this.token = token;
          this.user = JSON.parse(user);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
    },
    async login(username: string, password: string) {
        try {
          const response = await apiClient.post('/api/v1/auth/authenticate', { username, password });
          console.log("Backend Response:", response.data); // Logs the response from the backend
          this.token = response.data.access_token;
          this.user = response.data.user;
          localStorage.setItem('access_token', this.token as string);
          localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
          console.error('Login error:', error);
        }
      }
      ,
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    },
    register(email: string, password: string, name: string, lastname: string) {
              return apiClient
                .post('/api/v1/auth/register', {
                  email: email,
                  password: password,
                  firstname: name,
                  lastname: lastname,
                })
                .then((response) => {
                  console.log('Registration successful', response.data);
                  return response;
                })
                .catch((error) => {
                  console.error('Registration error', error);
                  throw error;
                });
            },
  },
});

