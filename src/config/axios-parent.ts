import axios from 'axios';
import { useTokenStore } from '../store/auth';

const instance = axios.create({
  baseURL: 'https://api-tias.ti.ft.uika-bogor.ac.id/staging/',
  validateStatus: status => status < 500,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor untuk inject token + logging request (debug)
instance.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token;
    }
    console.log(`[AXIOS-PARENT] >> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    return config;
  },
  (error) => {
    console.log('[AXIOS-PARENT] Request Error:', error?.message);
    return Promise.reject(error);
  }
);

// Interceptor untuk logging response (debug)
instance.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS-PARENT] << ${response.status} ${response.config.url}`, JSON.stringify(response.data).substring(0, 200));
    return response;
  },
  (error) => {
    console.log('[AXIOS-PARENT] Response Error:', error?.message);
    console.log('[AXIOS-PARENT] Response Data:', error?.response?.data);
    console.log('[AXIOS-PARENT] Response Status:', error?.response?.status);
    return Promise.reject(error);
  }
);


export default instance;
