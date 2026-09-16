import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api-tias.ti.ft.uika-bogor.ac.id/',
  validateStatus: status => status < 500,
  timeout: 15000, // 15 detik timeout
  headers: {
    'Content-Type': 'application/json',
    "Accept": "application/json",
  },
});

// Interceptor untuk logging request (debug)
instance.interceptors.request.use(
  (config) => {
    console.log(`[AXIOS-TIAS] >> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    return config;
  },
  (error) => {
    console.log('[AXIOS-TIAS] Request Error:', error?.message);
    return Promise.reject(error);
  }
);

// Interceptor untuk logging response (debug)
instance.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS-TIAS] << ${response.status} ${response.config.url}`, JSON.stringify(response.data).substring(0, 200));
    return response;
  },
  (error) => {
    console.log('[AXIOS-TIAS] Response Error:', error?.message);
    console.log('[AXIOS-TIAS] Response Data:', error?.response?.data);
    console.log('[AXIOS-TIAS] Response Status:', error?.response?.status);
    return Promise.reject(error);
  }
);


export default instance;
