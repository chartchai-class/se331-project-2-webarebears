import { defineStore } from 'pinia';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { User } from '@/type';
 
const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});
 
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null as string | null,
        user: null as User | null,
    }),
    getters: {
        currentUserName(): string {
            return this.user?.email || '';
        },
        isAdmin(): boolean {
            return this.user?.roles ? this.user.roles.includes('ROLE_ADMIN') : false;
        },
    },
    actions: {   
        login(email: string, password: string) {
    return apiClient
        .post('/api/v1/auth/authenticate', {
            username: email,
            password: password,
        })
        .then((response) => {
            this.token = response.data.access_token;
            this.user = response.data.user;
            localStorage.setItem('access_token', this.token as string);
            localStorage.setItem('user', JSON.stringify(this.user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
            return response;
        })
        .catch((error) => {
            console.error('Login error:', error.response ? error.response.data : error.message);
            throw error;
        });
},
        logout() {
            console.log('logout');
            this.token = null;
            this.user = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        },
        reload(token: string, user: User) {
            this.token = token;
            this.user = user;
        },
        register(email: string, password: string, name: string,lastname:string) {
            return apiClient
                .post('/api/v1/auth/register', {
                    email: email,
                    password: password,
                    firstname: name,
                    lastname:lastname
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
 