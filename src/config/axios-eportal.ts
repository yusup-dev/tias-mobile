import axios from 'axios';

const instance = axios.create({
  // Prefix ganda ("/eportal-api" dari nginx-waf + "/api" dari Laravel) —
  // lihat /etc/nginx/eportal-locations.conf di server eportal: nginx strip
  // "/eportal-api" lalu proxy sisanya ke backend, yang masih punya prefix
  // /api sendiri (RouteServiceProvider). Jangan disederhanakan jadi "/api/"
  // saja — itu jatuh ke fallback SPA frontend, bukan backend Laravel.
  baseURL: 'https://eportal.uika-bogor.ac.id/eportal-api/api/',
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
    console.log(`[AXIOS-EPORTAL] >> ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params || '');
    return config;
  },
  (error) => {
    console.log('[AXIOS-EPORTAL] Request Error:', error?.message);
    return Promise.reject(error);
  }
);

// Interceptor untuk logging response (debug)
instance.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS-EPORTAL] << ${response.status} ${response.config.url}`, JSON.stringify(response.data).substring(0, 200));
    return response;
  },
  (error) => {
    console.log('[AXIOS-EPORTAL] Response Error:', error?.message);
    console.log('[AXIOS-EPORTAL] Response Data:', error?.response?.data);
    console.log('[AXIOS-EPORTAL] Response Status:', error?.response?.status);
    return Promise.reject(error);
  }
);

export default instance;
