import axios from 'axios';

const API_BASE_URL = 'http://10.0.0.100:3333';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
