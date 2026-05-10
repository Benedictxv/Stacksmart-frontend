import axios from 'axios';

const API = axios.create({
    baseURL: 'https://stacksmart-backend.onrender.com/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getGoals = () => API.get('/goals/');
export const createGoal = (data) => API.post('/goals/', data);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

export const sendMessage = (message) => API.post('/coach/chat', { message });
export const getChatHistory = () => API.get('/coach/history');

export const getTransactions = () => API.get('/payments/transactions');
export const requestWithdrawal = (data) => API.post('/payments/withdraw', data);

export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);
export const uploadPhoto = (photo) => API.post('/user/profile/photo', { photo });