// src/services/api.js
import axios from 'axios';

const BASE = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE,
    timeout: 12000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const makeResource = (resource) => ({
    get: (path = '') => api.get(`/${resource}${path}`),
    post: (data) => api.post(`/${resource}`, data),
    put: (path, data) => api.put(`/${resource}${path}`, data),
    delete: (path) => api.delete(`/${resource}${path}`),
});

export const studentAPI = makeResource('students');
export const departmentAPI = makeResource('departments');
export const courseAPI = makeResource('courses');
export const addressAPI = makeResource('addresses');
export const enrollmentAPI = makeResource('enrollments');
export const feeAPI = makeResource('fees');
export const searchStudents = (keyword) =>
    api.get(`/students/search?keyword=${encodeURIComponent(keyword)}`);
export const filterStudents = (filters) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.minGpa) params.append('minGpa', filters.minGpa);
    return api.get(`/students/filter?${params.toString()}`);
};

export default api;