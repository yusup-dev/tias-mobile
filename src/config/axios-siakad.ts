import axios from 'axios';


const instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  validateStatus: status => status < 500,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor untuk logging request (debug)
instance.interceptors.request.use(
  (config) => {
    console.log(`[AXIOS-SIAKAD] >> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    return config;
  },
  (error) => {
    console.log('[AXIOS-SIAKAD] Request Error:', error?.message);
    return Promise.reject(error);
  }
);

// Interceptor untuk logging response (debug)
instance.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS-SIAKAD] << ${response.status} ${response.config.url}`, JSON.stringify(response.data).substring(0, 200));
    return response;
  },
  (error) => {
    console.log('[AXIOS-SIAKAD] Response Error:', error?.message);
    console.log('[AXIOS-SIAKAD] Response Data:', error?.response?.data);
    console.log('[AXIOS-SIAKAD] Response Status:', error?.response?.status);
    return Promise.reject(error);
  }
);

export default instance;
