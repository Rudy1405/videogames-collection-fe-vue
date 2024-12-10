/* eslint-disable prettier/prettier */
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // URL del backend
});

export default api;
