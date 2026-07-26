import axios from 'axios';

const mlApi = axios.create({
  baseURL: 'http://localhost:8000', // ML service running on port 8000
  headers: {
    'Content-Type': 'application/json',
  },
});

export default mlApi;
