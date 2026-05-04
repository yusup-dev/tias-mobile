import axios from 'axios';
import { useTokenStore } from '../store/auth';

const CBT_API_BASE_URL = 'https://u-talent.uika-bogor.ac.id/cbt-api/';

const axiosCbt = axios.create({
  baseURL: CBT_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Otomatis sisipkan CBT Token di setiap request ke CBT API
axiosCbt.interceptors.request.use(
  (config) => {
    const cbtToken = useTokenStore.getState().cbt_token;
    if (cbtToken) {
      config.headers.Authorization = `Bearer ${cbtToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Jika CBT Token expired (401), hapus dari store agar SSO diulang
axiosCbt.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useTokenStore.getState().clearCbtToken();
    }
    return Promise.reject(error);
  }
);

export default axiosCbt;
