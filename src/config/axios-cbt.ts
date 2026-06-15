import axios from 'axios';
import { useTokenStore } from '../store/auth';
import { refreshCbtToken } from '../services/cbt/refreshCbtToken';

const CBT_API_BASE_URL = 'https://u-talent.uika-bogor.ac.id/cbt-api/';

const axiosCbt = axios.create({
  baseURL: CBT_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Request: sisipkan CBT Token + paksa JSON ---
axiosCbt.interceptors.request.use(
  (config) => {
    const cbtToken = useTokenStore.getState().cbt_token;
    if (cbtToken) {
      config.headers.Authorization = `Bearer ${cbtToken}`;
    }
    // PENTING: paksa JSON supaya server tidak balas halaman HTML login saat sesi mati
    config.headers.Accept = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Deteksi expiry secara LUAS, bukan cuma 401 ---
// Server CBT (Laravel/PHP) saat sesi mati sering balas 419/440, redirect ke
// halaman HTML login, atau bahkan 200 berisi HTML — bukan 401 murni.
function isAuthExpired(error: any): boolean {
  const status = error?.response?.status;
  if (status === 401 || status === 419 || status === 440) return true;

  const ct = error?.response?.headers?.['content-type'] ?? '';
  const body = error?.response?.data;
  if (ct.includes('text/html')) return true;
  if (
    typeof body === 'string' &&
    /<html|<!doctype|login|silakan masuk/i.test(body)
  ) {
    return true;
  }

  return false;
}

axiosCbt.interceptors.response.use(
  (response) => {
    // Tangkap "sukses palsu": status 200 tapi isinya HTML login
    const ct = response.headers?.['content-type'] ?? '';
    if (ct.includes('text/html') && typeof response.data === 'string') {
      return Promise.reject({ config: response.config, __authExpired: true });
    }
    return response;
  },
  async (error) => {
    const original = error.config;
    const expired = error?.__authExpired || isAuthExpired(error);

    if (expired && original && !original.__isRetry) {
      original.__isRetry = true; // hanya retry SEKALI → cegah loop tak hingga

      const newToken = await refreshCbtToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosCbt(original); // ulangi request asli dengan token baru
      }
      // SSO gagal → token sudah dibersihkan di refreshCbtToken
    }

    return Promise.reject(error);
  }
);

export default axiosCbt;
