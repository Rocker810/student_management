// src/services/api.js
import axios from 'axios';

const BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Pattern: resourceAPI.get('/') or .get('/123')
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

export default api;
