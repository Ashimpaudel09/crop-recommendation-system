import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend running on port 3000
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
