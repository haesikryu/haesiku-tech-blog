import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `[API Error] ${error.response.status}: ${error.response.data?.message ?? 'Unknown error'}`
      );
    } else if (error.request) {
      console.error('[API Error] No response received');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
