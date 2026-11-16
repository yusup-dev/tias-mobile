import axios from 'axios';
import axiosTias from './axios-tias';
import {useTokenStore} from '../store/auth';

// Presensi (perkuliahan & rapat) kini NATIVE di server UCL: router `/fts` pada API UCL.
// (Dulu: https://absen.ft.uika-bogor.ac.id/api/ — server Laravel fts-absen, sudah dihentikan.)
const base = String(axiosTias.defaults.baseURL || '').replace(/\/+$/, '');

const instance = axios.create({
  baseURL: `${base}/fts/`,
  validateStatus: status => status < 500,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Semua rute /fts wajib login: lampirkan token sesi UCL otomatis.
instance.interceptors.request.use(config => {
  const token = useTokenStore.getState().token;
  if (token && !config.headers.get?.('token') && !(config.headers as any).token) {
    (config.headers as any).token = token;
  }
  return config;
});

export default instance;
